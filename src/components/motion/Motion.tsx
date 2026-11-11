"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { siteConfig } from "@/config/site";
import { splitChars } from "./split";
import { Lids } from "./Lids";
import styles from "./Motion.module.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const FINE = "(hover: hover) and (pointer: fine)";
const REDUCE = "(prefers-reduced-motion: reduce)";

export function Motion({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const preRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const lidTopRef = useRef<HTMLDivElement>(null);
  const lidBotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const readyRef = useRef<Promise<void>>(Promise.resolve());
  const coveredRef = useRef(false);

  // Global setup: smooth scroll, preloader, cursor, page transitions
  useEffect(() => {
    const reduce = window.matchMedia(REDUCE).matches;
    const root = document.documentElement;
    let resolveReady: () => void = () => {};
    readyRef.current = new Promise<void>((r) => (resolveReady = r));
    (window as unknown as { __motionReady?: boolean }).__motionReady = true;

    const cleanups: Array<() => void> = [];

    if (reduce) {
      root.classList.add("reduce-motion");
      if (preRef.current) preRef.current.style.display = "none";
      resolveReady();
      return;
    }

    // Smooth scroll
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = undefined;
    });

    // Preloader (first visit per session)
    let seen = false;
    try {
      seen = sessionStorage.getItem("preloaded") === "1";
    } catch {}
    const pre = preRef.current;
    if (!pre || seen) {
      if (pre) pre.style.display = "none";
      resolveReady();
    } else {
      lenis.stop();
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          pre.style.display = "none";
          lenis.start();
        },
      });
      tl.to(counter, {
        v: 100,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = String(Math.round(counter.v));
        },
      })
        .add(() => {
          try {
            sessionStorage.setItem("preloaded", "1");
          } catch {}
        })
        .to(pre, { yPercent: -100, duration: 0.8, ease: "expo.inOut" })
        .add(resolveReady, "-=0.5");
      cleanups.push(() => tl.kill());
    }

    // Custom cursor
    if (window.matchMedia(FINE).matches && ringRef.current) {
      const ring = ringRef.current;
      const label = labelRef.current;
      const xTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        ring.dataset.on = "1";
      };
      const onOver = (e: PointerEvent) => {
        const t = e.target as Element | null;
        const cue = t?.closest<HTMLElement>("[data-cursor]");
        const interactive = t?.closest("a, button, input, select, textarea, label");
        if (cue) {
          ring.dataset.state = "label";
          if (label) label.textContent = cue.dataset.cursor ?? "";
        } else if (interactive) {
          ring.dataset.state = "link";
        } else {
          ring.dataset.state = "";
          if (label) label.textContent = "";
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      });
    }

    // Glossy shine that follows the pointer or finger over photos
    const onShine = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-shine]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    window.addEventListener("pointermove", onShine, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onShine));

    // Haptic tick on taps (phones that support it)
    if (window.matchMedia("(pointer: coarse)").matches && "vibrate" in navigator) {
      const onTap = (e: PointerEvent) => {
        if ((e.target as Element | null)?.closest("a, button, label")) navigator.vibrate(8);
      };
      document.addEventListener("pointerdown", onTap, { passive: true });
      cleanups.push(() => document.removeEventListener("pointerdown", onTap));
    }

    // Magnifier lens over [data-lens] photos (desktop)
    if (window.matchMedia(FINE).matches) {
      const R = 88;
      const Z = 2.4;
      const lens = document.createElement("div");
      lens.className = styles.lens;
      lens.setAttribute("aria-hidden", "true");
      document.body.appendChild(lens);
      const onLens = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest<HTMLElement>("[data-lens]");
        const img = el?.querySelector("img");
        if (!el || !img || !img.complete || !img.naturalWidth) {
          lens.style.opacity = "0";
          return;
        }
        const r = img.getBoundingClientRect();
        const s = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
        const offX = (r.width - img.naturalWidth * s) / 2;
        const offY = (r.height - img.naturalHeight * s) / 2;
        lens.style.opacity = "1";
        lens.style.transform = `translate(${e.clientX - R}px, ${e.clientY - R}px)`;
        lens.style.backgroundImage = `url("${img.currentSrc}")`;
        lens.style.backgroundSize = `${img.naturalWidth * s * Z}px ${img.naturalHeight * s * Z}px`;
        lens.style.backgroundPosition = `${R - (e.clientX - r.left - offX) * Z}px ${R - (e.clientY - r.top - offY) * Z}px`;
      };
      window.addEventListener("pointermove", onLens, { passive: true });
      document.addEventListener("pointerleave", () => (lens.style.opacity = "0"));
      cleanups.push(() => {
        window.removeEventListener("pointermove", onLens);
        lens.remove();
      });
    }

    // Text scramble on hover: [data-scramble] letters shuffle and settle left to right
    if (window.matchMedia(FINE).matches) {
      const LATIN_UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const LATIN_LO = "abcdefghijklmnopqrstuvwxyz";
      const CYR_UP = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЮЯ";
      const CYR_LO = "абвгдежзиклмнопрстуфхцчшщюя";
      const running = new WeakMap<HTMLElement, gsap.core.Tween>();
      const onEnter = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest<HTMLElement>("[data-scramble]");
        if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return;
        const original = el.dataset.scrambleText ?? el.textContent ?? "";
        el.dataset.scrambleText = original;
        running.get(el)?.kill();
        const cyr = /[\u0400-\u04FF]/.test(original);
        const upper = original === original.toUpperCase();
        const pool = cyr ? (upper ? CYR_UP : CYR_LO) : upper ? LATIN_UP : LATIN_LO;
        el.style.display = el.style.display || "inline-block";
        el.style.minWidth = `${el.offsetWidth}px`;
        const state = { p: 0 };
        running.set(
          el,
          gsap.to(state, {
            p: 1,
            duration: 0.55,
            ease: "none",
            onUpdate: () => {
              const settled = Math.floor(state.p * original.length);
              el.textContent = Array.from(original)
                .map((ch, i) =>
                  ch === " " || i < settled ? ch : pool[Math.floor(Math.random() * pool.length)],
                )
                .join("");
            },
            onComplete: () => {
              el.textContent = original;
              el.style.minWidth = "";
            },
          }),
        );
      };
      document.addEventListener("pointerover", onEnter, { passive: true });
      cleanups.push(() => document.removeEventListener("pointerover", onEnter));
    }

    // Page transitions (curtain)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      const curtain = curtainRef.current;
      const top = lidTopRef.current;
      const bot = lidBotRef.current;
      if (!curtain || !top || !bot) return;
      e.preventDefault();
      coveredRef.current = true;
      lenis.stop();
      const go = () => router.push(url.pathname + url.search + url.hash);
      if (siteConfig.transition === "blink") {
        gsap.to(top, { yPercent: 0, duration: 0.55, ease: "power3.in" });
        gsap.to(bot, { yPercent: 0, duration: 0.55, ease: "power3.in", onComplete: go });
      } else {
        gsap.fromTo(
          curtain,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "expo.inOut", onComplete: go },
        );
      }
    };
    document.addEventListener("click", onClick, true);
    cleanups.push(() => document.removeEventListener("click", onClick, true));

    return () => cleanups.forEach((fn) => fn());
  }, [router]);

  // Per page: text reveals, masks, parallax, magnets, curtain open
  useEffect(() => {
    const reduce = window.matchMedia(REDUCE).matches;
    const curtain = curtainRef.current;
    const top = lidTopRef.current;
    const bot = lidBotRef.current;
    if (curtain && top && bot && coveredRef.current) {
      coveredRef.current = false;
      lenisRef.current?.scrollTo(0, { immediate: true });
      if (siteConfig.transition === "blink") {
        gsap.to(top, { yPercent: -100, duration: 0.8, delay: 0.12, ease: "power3.out" });
        gsap.to(bot, {
          yPercent: 100,
          duration: 0.8,
          delay: 0.12,
          ease: "power3.out",
          onComplete: () => lenisRef.current?.start(),
        });
      } else {
        gsap.to(curtain, {
          yPercent: -100,
          duration: 0.9,
          delay: 0.15,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(curtain, { yPercent: 100 });
            lenisRef.current?.start();
          },
        });
      }
    }

    if (reduce) {
      document
        .querySelectorAll<HTMLElement>("[data-split]")
        .forEach((el) => (el.dataset.split = "ready"));
      document
        .querySelectorAll<HTMLElement>("[data-mask]")
        .forEach((el) => (el.dataset.mask = "ready"));
      return;
    }

    let killed = false;
    const ctx = gsap.context(() => {
      readyRef.current.then(() => {
        if (killed) return;
        // Text: characters rise out of word masks
        document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          const chars =
            el.dataset.splitDone === "1"
              ? Array.from(el.querySelectorAll<HTMLElement>(".c"))
              : splitChars(el);
          el.dataset.splitDone = "1";
          gsap.set(chars, { yPercent: 118 });
          el.dataset.split = "ready";
          const delay = Number(el.dataset.delay ?? 0);
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () =>
              gsap.to(chars, {
                yPercent: 0,
                duration: 1.1,
                delay,
                ease: "expo.out",
                stagger: { each: 0.018 },
              }),
          });
        });

        // Photos: mask open
        document.querySelectorAll<HTMLElement>("[data-mask]").forEach((el) => {
          gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
          el.dataset.mask = "ready";
          gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Parallax inside frames
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const v = Number(el.dataset.parallax ?? 0.1);
          gsap.fromTo(
            el,
            { yPercent: -v * 100, scale: 1 + v * 2 },
            {
              yPercent: v * 100,
              scale: 1 + v * 2,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Statement lights up word by word as you scroll
        document.querySelectorAll<HTMLElement>("[data-lightwords]").forEach((el) => {
          if (el.dataset.lwDone !== "1") {
            const walk = (node: Node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                (node.textContent ?? "").split(/(\s+)/).forEach((part) => {
                  if (!part) return;
                  if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(" "));
                    return;
                  }
                  const w = document.createElement("span");
                  w.className = "lw";
                  w.textContent = part;
                  frag.appendChild(w);
                });
                node.parentNode?.replaceChild(frag, node);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(walk);
              }
            };
            Array.from(el.childNodes).forEach(walk);
            el.dataset.lwDone = "1";
          }
          const words = Array.from(el.querySelectorAll<HTMLElement>(".lw"));
          gsap.set(words, { opacity: 0.2 });
          gsap.to(words, {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: true },
          });
        });

        ScrollTrigger.refresh();
      });

      // Magnetic buttons
      if (window.matchMedia(FINE).matches) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      killed = true;
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <>
      <div ref={preRef} className={styles.pre} aria-hidden="true">
        <span className={styles.preName}>{name}</span>
        <span className={styles.preCount}>
          <span ref={countRef}>0</span>
        </span>
      </div>
      <div ref={curtainRef} className={styles.curtain} aria-hidden="true">
        <span>{name}</span>
      </div>
      <Lids topRef={lidTopRef} botRef={lidBotRef} />
      <div ref={ringRef} className={styles.ring} aria-hidden="true">
        <span ref={labelRef} className={styles.label} />
      </div>
    </>
  );
}
