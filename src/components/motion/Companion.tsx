"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { FRAG, VERT } from "./chromeShader";
import styles from "./Companion.module.css";

// A chrome drop that travels with the visitor down the whole page. It drifts along the right edge
// on a wavy path and its shape melts and splits as the scroll position changes.
export function Companion() {
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = pathname === "/";

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    if (!active || !box || !cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    let x = 0;
    let y = 0;
    let started = false;
    let raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const TAU = Math.PI * 2;

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.tx = Math.max(-1.4, Math.min(1.4, ((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1)) * 2.4));
      mouse.ty = Math.max(-1.2, Math.min(1.2, (-(e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1)) * 2.4));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const doc = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / doc));
      const size = box.offsetWidth;
      const mobile = vw < 900;

      // wavy path along the right edge
      const tx = vw * (mobile ? 0.86 : 0.88 + 0.045 * Math.sin(p * TAU * 3.2)) - size / 2;
      const ty = vh * (0.5 + (mobile ? 0.2 : 0.27) * Math.sin(p * TAU * 4.3 + 1)) - size / 2;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

      // it joins the visitor once the hero has been scrolled past, and leaves before the footer
      const footer = document.querySelector("footer");
      const nearFooter = footer ? footer.getBoundingClientRect().top < vh * 0.8 : false;
      const intro = Math.min(1, Math.max(0, (window.scrollY - vh * 0.55) / (vh * 0.35)));
      box.style.opacity = String(nearFooter ? 0 : intro);

      if (intro <= 0.01) return;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(cv.clientWidth * dpr));
      if (cv.width !== w) {
        cv.width = w;
        cv.height = w;
      }
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, p);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div ref={wrap} className={styles.orb} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}
