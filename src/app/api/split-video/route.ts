import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import ffmpegStatic from "ffmpeg-static";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

// Force Node runtime — ffmpeg-static binaries do not work on Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Segment = { start: string; end: string; name: string };

function run(bin: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (c: Buffer) => (stdout += c.toString()));
    proc.stderr.on("data", (c: Buffer) => (stderr += c.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(bin)} exited ${code}:\n${stderr}`));
    });
  });
}

async function probeDuration(probeBin: string, input: string): Promise<number> {
  const { stdout } = await run(probeBin, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    input,
  ]);
  const sec = parseFloat(stdout.trim());
  if (Number.isNaN(sec)) throw new Error(`Could not parse duration from ffprobe: ${stdout}`);
  return sec;
}

function secondsToTimestamp(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec - h * 3600 - m * 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

async function cutSegment(
  ffmpegBin: string,
  input: string,
  output: string,
  start: string,
  end: string,
  reencode: boolean
): Promise<void> {
  // -c copy is fastest but only works when container + codec are already web-compatible.
  // For .mov / ProRes / HEVC we must re-encode to H.264 + AAC so all browsers can play.
  const baseArgs = ["-y", "-i", input, "-ss", start, "-to", end];

  const codecArgs = reencode
    ? [
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an", // strip audio — this is a background loop
      ]
    : ["-c", "copy", "-avoid_negative_ts", "make_zero"];

  await run(ffmpegBin, [...baseArgs, ...codecArgs, output]);
}

export async function POST(req: NextRequest) {
  try {
    const ffmpegBin = ffmpegStatic;
    const probeBin = ffprobeInstaller.path;
    if (!ffmpegBin) {
      return NextResponse.json({ error: "ffmpeg-static binary not resolved" }, { status: 500 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      input?: string;
      segments?: Segment[];
      outputDir?: string;
      chunkSeconds?: number;
      reencode?: boolean;
      ext?: "mp4" | "webm";
    };

    const publicDir = path.join(process.cwd(), "public");
    const inputPath = body.input
      ? path.resolve(process.cwd(), body.input.replace(/^\//, ""))
      : path.join(publicDir, "about-bg-source.mov");

    const outputDir = body.outputDir
      ? path.resolve(process.cwd(), body.outputDir.replace(/^\//, ""))
      : path.join(publicDir, "segments");

    try {
      await fs.access(inputPath);
    } catch {
      return NextResponse.json({ error: `Input not found: ${inputPath}` }, { status: 404 });
    }

    // Re-encode is required for .mov / non-H264. Default to true to be safe.
    const reencode = body.reencode ?? true;
    const ext = body.ext ?? "mp4";

    // Build segments: either explicit list, or auto-chunk by duration.
    let segments: Segment[];
    if (body.segments?.length) {
      segments = body.segments;
    } else {
      const duration = await probeDuration(probeBin, inputPath);
      const chunkSeconds = body.chunkSeconds ?? 4; // small chunks → fast first-paint
      segments = [];
      let i = 0;
      for (let t = 0; t < duration; t += chunkSeconds) {
        const start = secondsToTimestamp(t);
        const end = secondsToTimestamp(Math.min(t + chunkSeconds, duration));
        segments.push({ start, end, name: `part${String(i + 1).padStart(2, "0")}.${ext}` });
        i++;
      }
    }

    await fs.mkdir(outputDir, { recursive: true });

    const results: { name: string; publicUrl: string; bytes: number }[] = [];
    for (const seg of segments) {
      const outPath = path.join(outputDir, seg.name);
      await cutSegment(ffmpegBin, inputPath, outPath, seg.start, seg.end, reencode);
      const stat = await fs.stat(outPath);
      const rel = path.relative(publicDir, outPath).split(path.sep).join("/");
      results.push({ name: seg.name, publicUrl: `/${rel}`, bytes: stat.size });
    }

    return NextResponse.json({
      ok: true,
      input: inputPath,
      outputDir,
      reencoded: reencode,
      totalSegments: results.length,
      segments: results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const fakeReq = new NextRequest("http://localhost/api/split-video", {
    method: "POST",
    body: JSON.stringify({}),
  });
  return POST(fakeReq);
}
