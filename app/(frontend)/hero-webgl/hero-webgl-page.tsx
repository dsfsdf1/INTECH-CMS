"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteNavigation } from "../site-navigation";
import styles from "./hero-webgl.module.css";
import { SurfaceCanvas } from "./scene/surface-canvas";
import { useHeroScroll } from "./use-hero-scroll";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

type HeroWebglPageProps = {
  variant?: "standard" | "full";
};

export function HeroWebglPage({
  variant = "standard",
}: HeroWebglPageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const progressRef = useHeroScroll(sectionRef, copyRef, reducedMotion);
  const fullVariant = variant === "full";

  return (
    <main
      className={
        fullVariant ? `${styles.page} ${styles.fullPage}` : styles.page
      }
    >
      <SiteNavigation active={fullVariant ? "webgl-v2" : "webgl"} dark />

      <section
        aria-labelledby="hero-webgl-title"
        className={styles.scrollSection}
        ref={sectionRef}
      >
        <div
          className={
            fullVariant
              ? `${styles.stage} ${styles.fullStage}`
              : styles.stage
          }
        >
          <SurfaceCanvas
            fullBleed={fullVariant}
            progressRef={progressRef}
            reducedMotion={reducedMotion}
          />
          <div
            className={
              fullVariant
                ? `${styles.readabilityMask} ${styles.fullReadabilityMask}`
                : styles.readabilityMask
            }
            aria-hidden="true"
          />

          <div
            className={
              fullVariant
                ? `${styles.copy} ${styles.fullCopy}`
                : styles.copy
            }
            ref={copyRef}
          >
            <h1 id="hero-webgl-title">
              <span>Превращаем бизнес-задачи</span>{" "}
              <span>в работающие цифровые продукты</span>
            </h1>
            {fullVariant ? null : (
              <>
                <p>
                  Исследуем процессы, проектируем решения, создаём web- и
                  mobile-продукты, backend, интеграции, аналитику и AI.
                </p>
                <div className={styles.actions}>
                  <Link className={styles.primaryAction} href="/#contact">
                    Обсудить задачу
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <Link className={styles.secondaryAction} href="/#services">
                    Смотреть направления
                    <span aria-hidden="true">↓</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.handoff} aria-labelledby="handoff-title">
        <div>
          <p>Цифровые системы полного цикла</p>
          <h2 id="handoff-title">
            От сложной задачи — к ясной работающей системе.
          </h2>
        </div>
        <Link href="/#services">
          Перейти к направлениям
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
