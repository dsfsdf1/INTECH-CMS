"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";

export function useHeroScroll(
  sectionRef: RefObject<HTMLElement | null>,
  copyRef: RefObject<HTMLDivElement | null>,
  reducedMotion: boolean,
): MutableRefObject<number> {
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy || reducedMotion) {
      progressRef.current = reducedMotion ? 0.12 : 0;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const compact = window.matchMedia("(max-width: 699px)").matches;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
          scrub: 0.45,
        },
      });

      timeline.to(
        copy,
        {
          autoAlpha: 0.18,
          y: compact ? -18 : -34,
          duration: 0.18,
        },
        compact ? 0.9 : 0.82,
      );
    }, section);

    return () => context.revert();
  }, [copyRef, reducedMotion, sectionRef]);

  return progressRef;
}
