"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CascadeGraphic({ color = "#ffffff" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Create 5 browser card divs absolutely positioned
    const cards: HTMLDivElement[] = [];
    const count = 5;
    const cardHeight = 110;
    const gap = 24;
    const step = cardHeight + gap;
    const totalHeight = step * count;

    for (let i = 0; i < count; i++) {
      const card = document.createElement("div");
      card.style.cssText = `
        position: absolute;
        left: 20px;
        right: 20px;
        height: ${cardHeight}px;
        border: 1.5px solid ${color};
        border-radius: 10px;
        background: rgba(255,255,255,0.05);
        opacity: 0.9;
        box-sizing: border-box;
        overflow: hidden;
      `;

      // Chrome bar
      const bar = document.createElement("div");
      bar.style.cssText = `
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 6px;
      `;
      [0.9, 0.5, 0.3].forEach((op) => {
        const dot = document.createElement("div");
        dot.style.cssText = `width:7px;height:7px;border-radius:50%;background:${color};opacity:${op};flex-shrink:0;`;
        bar.appendChild(dot);
      });
      // URL pill
      const url = document.createElement("div");
      url.style.cssText = `flex:1;height:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.07);margin-left:8px;`;
      bar.appendChild(url);
      card.appendChild(bar);

      // Content lines
      const content = document.createElement("div");
      content.style.cssText = `position:absolute;top:34px;left:12px;right:12px;`;
      const lineWidths = ["55%", "80%", "65%", "40%"];
      lineWidths.forEach((w, li) => {
        const line = document.createElement("div");
        line.style.cssText = `width:${w};height:${li === 0 ? 9 : 5}px;border-radius:3px;background:${color};opacity:${li === 0 ? 0.7 : 0.25};margin-bottom:7px;`;
        content.appendChild(line);
      });
      // CTA button
      const btn = document.createElement("div");
      btn.style.cssText = `width:70px;height:18px;border-radius:9px;background:${color};opacity:0.8;margin-top:4px;`;
      content.appendChild(btn);
      card.appendChild(content);

      // Image block
      const img = document.createElement("div");
      img.style.cssText = `position:absolute;top:30px;right:12px;width:60px;height:54px;border-radius:6px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.1);`;
      card.appendChild(img);

      // Set initial Y
      gsap.set(card, { y: i * step });
      container.appendChild(card);
      cards.push(card);
    }

    // Animate all cards downward, wrapping from bottom to top
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: `+=${totalHeight}`,
        duration: 4,
        ease: "none",
        repeat: -1,
        delay: -(i / count) * 4, // stagger start so they're spread out immediately
        modifiers: {
          y: gsap.utils.unitize((y) => {
            // wrap: once past totalHeight, jump back to top (-cardHeight)
            return ((parseFloat(y) % totalHeight) + totalHeight) % totalHeight - cardHeight;
          }),
        },
      });
    });

    return () => {
      gsap.killTweensOf(cards);
      cards.forEach((c) => c.remove());
    };
  }, [color]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
