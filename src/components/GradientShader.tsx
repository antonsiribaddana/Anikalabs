"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  // ── Simplex 2D noise ──
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
             dot(x12.zw,x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 st = uv;
    st.x *= aspect;

    float t = uTime * 0.4;
    float s = uScroll;

    // Mouse influence
    vec2 mouse = uMouse;
    mouse.x *= aspect;
    vec2 mouseWarp = (st - mouse) * 0.05 / (length(st - mouse) + 0.6);

    // ── Smooth domain warping — gives the blobs organic morphing shape ──
    float w1 = snoise((st + mouseWarp) * 0.5 + t * 0.15) * 0.18;
    float w2 = snoise((st - mouseWarp) * 0.4 - t * 0.12 + 3.0) * 0.15;
    vec2 warped = st + vec2(w1, w2);

    // ── 4 blobs — scattered around, clearly visible, moving noticeably ──
    // Bigger orbit radii + faster speeds = visible movement
    vec2 c1 = vec2(
      0.25 * aspect + sin(t * 0.5) * 0.3 * aspect,
      0.7 + cos(t * 0.4) * 0.2 - s * 0.15
    );
    vec2 c2 = vec2(
      0.75 * aspect + cos(t * 0.45) * 0.25 * aspect,
      0.3 + sin(t * 0.55) * 0.25 + s * 0.12
    );
    vec2 c3 = vec2(
      0.5 * aspect + sin(t * 0.3 + 2.0) * 0.2 * aspect,
      0.5 + cos(t * 0.35 + 1.5) * 0.22
    );
    vec2 c4 = vec2(
      0.6 * aspect + cos(t * 0.38 + 3.5) * 0.28 * aspect,
      0.6 + sin(t * 0.42 + 2.5) * 0.18 - s * 0.1
    );

    // Tight gaussian blobs — visible concentrated color pools
    float b1 = exp(-3.0 * dot(warped - c1, warped - c1));
    float b2 = exp(-2.5 * dot(warped - c2, warped - c2));
    float b3 = exp(-3.5 * dot(warped - c3, warped - c3));
    float b4 = exp(-2.8 * dot(warped - c4, warped - c4));

    // ── Color palette — deep, dark, subtle ──
    vec3 base    = vec3(0.005, 0.005, 0.02);      // true dark
    vec3 purple  = vec3(0.18, 0.03, 0.40);         // muted deep purple
    vec3 blue    = vec3(0.03, 0.12, 0.42);          // dark blue
    vec3 violet  = vec3(0.22, 0.05, 0.38);          // dark violet
    vec3 indigo  = vec3(0.08, 0.04, 0.30);          // deep indigo

    // ── Compose — subtle color pools on dark canvas ──
    vec3 color = base;
    color += purple * b1 * 0.55;
    color += blue   * b2 * 0.50;
    color += violet * b3 * 0.40;
    color += indigo * b4 * 0.45;

    // Subtle bright accents only where blobs overlap
    float overlap12 = b1 * b2;
    float overlap23 = b2 * b3;
    color += vec3(0.15, 0.08, 0.45) * overlap12 * 0.8;
    color += vec3(0.06, 0.18, 0.50) * overlap23 * 0.7;

    // Scroll subtly brightens
    color *= 1.0 + s * 0.08;

    // Vignette
    float vig = 1.0 - 0.3 * pow(length((uv - 0.5) * 1.3), 2.0);
    color *= vig;

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function GradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
    }

    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking — smooth follow
    const targetMouse = { x: 0.5, y: 0.5 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // ScrollTrigger
    const parent = canvas.closest("[data-wwd-section]") as HTMLElement;
    if (parent) {
      ScrollTrigger.create({
        trigger: parent,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });
    }

    const startTime = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth mouse lerp
      mouseRef.current.x += (targetMouse.x - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (targetMouse.y - mouseRef.current.y) * 0.03;

      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScroll, scrollRef.current);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
