"use client";

import { useEffect, useRef } from "react";
import { animate, random } from "animejs";

function createPetal(container: HTMLElement) {
  const petal = document.createElement("div");
  const size = random(8, 16);
  const rotation = random(0, 360);

  petal.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(ellipse at 30% 30%, #f5d0e3, #e8a0bf);
    border-radius: 50% 0 50% 0;
    opacity: 0;
    pointer-events: none;
    z-index: 50;
    top: -20px;
    left: ${random(0, 100)}vw;
    transform: rotate(${rotation}deg);
    box-shadow: 0 0 ${size / 2}px rgba(232, 160, 191, 0.3);
  `;

  container.appendChild(petal);

  const duration = random(6000, 12000);

  animate(petal, {
    translateY: window.innerHeight + 40,
    translateX: [0, random(-100, 100)],
    rotate: `+=${random(180, 720)}`,
    opacity: [0, 0.8, 0.8, 0],
    ease: "inOutQuad",
    duration,
    delay: random(0, 2000),
    onComplete: () => {
      petal.remove();
    },
  });
}

export default function CherryBlossoms() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        createPetal(container);
      }
    }, random(300, 800));

    return () => {
      clearInterval(interval);
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
}
