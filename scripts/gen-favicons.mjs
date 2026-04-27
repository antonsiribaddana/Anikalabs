import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/images/logo-mark.svg"));
const bg = { r: 2, g: 2, b: 30, alpha: 1 };

async function render(size, padRatio = 0.16) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const markPng = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: markPng, gravity: "center" }])
    .png()
    .toBuffer();
}

async function renderTransparent(size) {
  return sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

const icon32 = await render(32, 0.1);
const icon180 = await render(180, 0.16);
const icon512 = await render(512, 0.16);
const ogImage = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: bg },
})
  .composite([{ input: await renderTransparent(360), gravity: "center" }])
  .jpeg({ quality: 88 })
  .toBuffer();

writeFileSync(join(root, "src/app/icon.png"), icon32);
writeFileSync(join(root, "src/app/apple-icon.png"), icon180);
writeFileSync(join(root, "public/icon-512.png"), icon512);
writeFileSync(join(root, "public/og-image.jpg"), ogImage);

// Build a multi-size .ico (16, 32, 48) — minimal ICO writer.
async function ico() {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => render(s, 0.08)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(sizes.length, 4);
  const entries = [];
  let offset = 6 + sizes.length * 16;
  for (let i = 0; i < sizes.length; i++) {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0);
    e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(pngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += pngs[i].length;
  }
  return Buffer.concat([header, ...entries, ...pngs]);
}

writeFileSync(join(root, "src/app/favicon.ico"), await ico());

console.log("favicons written.");
