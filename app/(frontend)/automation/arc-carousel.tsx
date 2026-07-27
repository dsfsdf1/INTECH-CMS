"use client";

import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { AutomationArticle } from "./data";
import { IconArrowLeft, IconArrowRight } from "./icons";

type Props = { articles: AutomationArticle[] };
type PointerSample = { id: number; x: number; y: number; time: number };

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

function shortestOffset(index: number, activeIndex: number, count: number) {
  let offset = (index - activeIndex) % count;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

function readStoredIndex(count: number) {
  if (typeof window === "undefined") return 0;
  const storedIndex = Number(window.sessionStorage.getItem("intech-automation-carousel"));
  return Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < count ? storedIndex : 0;
}

export function ArcCarousel({ articles }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [supports3d, setSupports3d] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const pointerRef = useRef<PointerSample | null>(null);
  const wheelLock = useRef(0);

  // Session restoration is deliberately deferred until after hydration.
  // This keeps server and client markup identical on the first render.
  useEffect(() => {
    const storedIndex = readStoredIndex(articles.length);
    activeIndexRef.current = storedIndex;
    setActiveIndex(storedIndex);
    setPreviousIndex(storedIndex);
  }, [articles.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const compactQuery = window.matchMedia("(max-width: 680px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMedia = () => {
      setCompact(compactQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    const syncSize = () => {
      const nextWidth = Math.round(stage.getBoundingClientRect().width);
      setStageWidth((currentWidth) => Math.abs(currentWidth - nextWidth) > 4 ? nextWidth : currentWidth);
    };
    const observer = new ResizeObserver(syncSize);
    const viewportObserver = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting && !document.hidden), { threshold: 0.08 });
    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        return;
      }
      const bounds = stage.getBoundingClientRect();
      setIsVisible(bounds.bottom > 0 && bounds.top < window.innerHeight);
    };

    setSupports3d(CSS.supports("transform-style", "preserve-3d"));
    syncMedia();
    syncSize();
    observer.observe(stage);
    viewportObserver.observe(stage);
    compactQuery.addEventListener("change", syncMedia);
    motionQuery.addEventListener("change", syncMedia);
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    return () => {
      observer.disconnect();
      viewportObserver.disconnect();
      compactQuery.removeEventListener("change", syncMedia);
      motionQuery.removeEventListener("change", syncMedia);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    const normalizedIndex = wrapIndex(nextIndex, articles.length);
    if (normalizedIndex === activeIndexRef.current) return;
    setPreviousIndex(activeIndexRef.current);
    activeIndexRef.current = normalizedIndex;
    setActiveIndex(normalizedIndex);
    window.sessionStorage.setItem("intech-automation-carousel", String(normalizedIndex));
  }, [articles.length]);
  const goBy = useCallback((amount: number) => goTo(activeIndexRef.current + amount), [goTo]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleWheel = (event: WheelEvent) => {
      if (!isVisible || reducedMotion || document.hidden) return;
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.7 || event.shiftKey;
      const focusedVerticalIntent = document.activeElement === stage && Math.abs(event.deltaY) > 20;
      if (!horizontalIntent && !focusedVerticalIntent) return;
      const delta = horizontalIntent ? event.deltaX || event.deltaY : event.deltaY;
      if (Math.abs(delta) < 14) return;
      const now = performance.now();
      if (now - wheelLock.current < 320) return;
      wheelLock.current = now;
      event.preventDefault();
      goBy(delta > 0 ? 1 : -1);
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [goBy, isVisible, reducedMotion]);

  const geometry = useMemo(() => {
    const narrow = compact || stageWidth < 720;
    return {
      visibleOffset: narrow ? 1 : 3,
      angle: narrow ? 25 : 18,
      horizontalRadius: narrow ? Math.max(250, stageWidth * 0.79) : Math.max(620, stageWidth * 0.56),
      depthRadius: narrow ? 300 : 880,
      edgeGap: narrow ? 26 : 30,
      baseScale: narrow ? 1 : 0.9,
      scaleStep: narrow ? -0.11 : 0.045,
    };
  }, [compact, stageWidth]);

  const completePointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    const elapsed = Math.max(1, event.timeStamp - pointer.time);
    const velocity = Math.abs(dx) / elapsed;
    pointerRef.current = null;
    if (Math.abs(dx) <= Math.abs(dy) || (Math.abs(dx) < 42 && velocity < 0.45)) return;
    goBy(dx < 0 ? 1 : -1);
  }, [goBy]);

  return (
    <section className="automation-carousel" aria-label="Виды автоматизации">
      <p className="sr-only" aria-live="polite">Выбрано направление: {articles[activeIndex]?.title}</p>
      <div
        className="automation-carousel-stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="карусель"
        aria-label="Виды автоматизации: используйте стрелки, горизонтальный скролл или свайп"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); goBy(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); goBy(1); }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp };
        }}
        onPointerUp={completePointer}
        onPointerCancel={() => { pointerRef.current = null; }}
      >
        <div className="automation-carousel-curve" aria-hidden="true" />
        {articles.map((article, index) => {
          const offset = shortestOffset(index, activeIndex, articles.length);
          const previousOffset = shortestOffset(index, previousIndex, articles.length);
          const crossesSeam = Math.abs(offset - previousOffset) > articles.length / 2;
          const visible = !supports3d || Math.abs(offset) <= geometry.visibleOffset;
          const angle = offset * geometry.angle;
          const radians = (angle * Math.PI) / 180;
          const x = Math.sin(radians) * geometry.horizontalRadius + Math.sign(offset) * Math.max(0, Math.abs(offset) - 1) * geometry.edgeGap;
          const z = geometry.depthRadius - Math.cos(radians) * geometry.depthRadius;
          const scale = geometry.baseScale + Math.abs(offset) * geometry.scaleStep;
          const style = {
            transform: `translate3d(calc(-50% + ${x}px), 0, ${z}px) rotateY(${-angle}deg) scale(${scale})`,
            opacity: visible ? Math.max(0.28, 1 - Math.abs(offset) * 0.18) : 0,
            zIndex: 20 - Math.abs(offset),
            transitionDuration: reducedMotion || crossesSeam ? "1ms" : "680ms",
          } as CSSProperties;
          return (
            <div className="automation-carousel-position" style={style} key={article.id} aria-hidden={!visible}>
              <button
                type="button"
                className="automation-carousel-card"
                data-active={index === activeIndex}
                tabIndex={visible ? 0 : -1}
                aria-label={`${article.title}. ${index === activeIndex ? "Обсудить автоматизацию" : "Выбрать направление"}`}
                onClick={() => {
                  if (index === activeIndex) window.location.assign(`/insights/automation/${article.slug}`);
                  else goTo(index);
                }}
              >
                <span className="automation-carousel-frame">
                  <img src={article.image} alt="" />
                  <span className="automation-card-shade" />
                  <span className="automation-card-copy">
                    <strong>{article.title}</strong>
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="automation-carousel-controls">
        <button type="button" aria-label="Предыдущее направление" onClick={() => goBy(-1)}><IconArrowLeft /></button>
        <div className="automation-carousel-dots" aria-label="Выбрать направление">
          {articles.map((article, index) => <button type="button" key={article.id} aria-label={article.title} data-active={index === activeIndex} onClick={() => goTo(index)} />)}
        </div>
        <button type="button" aria-label="Следующее направление" onClick={() => goBy(1)}><IconArrowRight /></button>
      </div>
    </section>
  );
}
