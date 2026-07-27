"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FormEvent, useEffect, useRef, useState } from "react";
import { automationArticles } from "./automation/data";
import { SiteNavigation } from "./site-navigation";
import type { HomeCmsContent } from "@/lib/cms-content";
import { trackLeadSubmission } from "@/lib/analytics";
import { CmsRichText, hasCmsRichText } from "@/components/CmsRichText";

const services = [
  {
    number: "01",
    title: "Автоматизация бизнеса",
    text: "Связываем данные, сотрудников и решения в один управляемый процесс.",
    detail: "Заявки, продажи, документы, отчётность, закупки и внутренние сервисы.",
    image: "/intech/robotic-lab.jpg",
    alt: "Автоматизированный лабораторный комплекс за стеклом",
  },
  {
    number: "02",
    title: "Цифровые продукты",
    text: "Проектируем B2B-платформы, кабинеты и внутренние системы.",
    detail: "Исследование, UX/UI, frontend, backend, интеграции, запуск и развитие.",
    image: "/intech/room-market-dashboard.png",
    alt: "Интерфейс аналитической системы мониторинга цен",
  },
  {
    number: "03",
    title: "Битрикс24 и интеграции",
    text: "Собираем продажи и сервис в единой понятной архитектуре.",
    detail: "CRM, телефония, документы, склад, ERP, API и управленческая аналитика.",
    image: "/intech/data-infrastructure.jpg",
    alt: "Инженерная вычислительная инфраструктура",
  },
  {
    number: "04",
    title: "Сложные web-системы",
    text: "Создаём интерфейсы, которые становятся частью самого продукта.",
    detail: "Каталоги, личные кабинеты, оплаты, админки, SEO и аналитика.",
    image: "/intech/silver-architecture.jpg",
    alt: "Фасад современной архитектуры из стекла и металла",
  },
];

export function HomePage({ content }: { content?: HomeCmsContent }) {
  const PrimaryHeading = content?.primaryHeadingTag ?? "h1";
  const [activeService, setActiveService] = useState(0);
  const [sent, setSent] = useState(false);
  const heroScrollRef = useRef<HTMLElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const heroScroll = heroScrollRef.current;
    const heroCopy = heroCopyRef.current;
    const heroFrame = heroFrameRef.current;
    const heroOverlay = heroOverlayRef.current;

    if (
      !heroScroll ||
      !heroCopy ||
      !heroFrame ||
      !heroOverlay ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroScroll,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(heroCopy, { autoAlpha: 0, y: -24, duration: 0.18 }, 0.12)
        .to(
          heroFrame,
          {
            top: 0,
            left: 0,
            width: "100vw",
            height: "100svh",
            borderRadius: 0,
            xPercent: 0,
            duration: 0.38,
          },
          0.12,
        )
        .to(heroOverlay, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.54)
        .to(heroOverlay, { autoAlpha: 0, y: -18, duration: 0.16 }, 0.84);
    }, heroScroll);

    return () => context.revert();
  }, []);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/lead-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), contact: form.get("contact"), message: form.get("task"), source: "Главная", utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"), utmTerm: params.get("utm_term"), utmContent: params.get("utm_content"), landingPage: window.location.href, referrer: document.referrer }) });
    if (response.ok) { trackLeadSubmission(); setSent(true); }
  }

  return (
    <main>
      <SiteNavigation active="home" />

      <section className="hero-scroll" id="top" ref={heroScrollRef}>
        <div className="hero-stage">
          <div className="hero-media-wrap" ref={heroFrameRef}>
            <video autoPlay muted loop playsInline preload="auto" poster="/intech/video/intech-particles-poster.webp">
              {content?.hero?.video ? (
                <source src={content.hero.video} />
              ) : (
                <>
                  <source src="/intech/video/intech-particles-loop.webm" type="video/webm" />
                  <source src="/intech/video/intech-particles-loop.mp4" type="video/mp4" />
                </>
              )}
            </video>
          </div>

          <div className="hero-copy" ref={heroCopyRef}>
            {hasCmsRichText(content?.hero?.titleRichText) ? <CmsRichText value={content?.hero?.titleRichText} className="page-primary-heading rich-text-heading" /> : <PrimaryHeading className="page-primary-heading">
              Превращаем сложные процессы в<br />
              <em>{content?.hero?.accent ?? "работающие цифровые системы"}</em>
            </PrimaryHeading>}
          </div>

          <p className="hero-video-message" ref={heroOverlayRef}>
            {hasCmsRichText(content?.hero?.messageRichText) ? <CmsRichText value={content?.hero?.messageRichText} className="rich-text-copy" /> : <>Сложное — внутри.<br />Ясное — снаружи.</>}
          </p>
        </div>
      </section>

      <section className="statement" data-reveal>
        <p>{content?.statement?.eyebrow ?? "Сначала — точный вопрос"}</p>
        <h2>
          {content?.statement?.title ?? <>
            Не внедряем программу ради программы.{" "}
            <span>Находим место, где бизнес теряет время,</span>{" "}
            <em>и меняем сам процесс.</em>
          </>}
        </h2>
      </section>

      <section className="image-editorial" aria-label="Визуальное направление">
        <div className="editorial-copy" data-reveal>
          <h2>
            Инженерная точность.
            <span> Человеческая ясность.</span>
          </h2>
          <p>
            Интерфейс не должен демонстрировать сложность системы. Он должен
            позволять принимать решение быстрее и увереннее.
          </p>
        </div>
        <div className="editorial-stage">
          <figure className="editorial-main" data-reveal>
            <img
              src="/intech/silver-architecture.jpg"
              alt="Ритмичный фасад из стекла и металла"
            />
          </figure>
          <figure className="editorial-inset" data-reveal>
            <img
              src="/intech/data-infrastructure.jpg"
              alt="Фрагмент сложной вычислительной инфраструктуры"
            />
          </figure>
          <p className="editorial-quote">
            Сложная архитектура может выглядеть спокойно.
          </p>
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-heading" data-reveal>
          <h2>Направления</h2>
          <p>
            Можно прийти с проблемой, а не с готовым техническим заданием. Мы
            поможем сформулировать решение и его границы.
          </p>
        </div>

        <div className="services-layout desktop-services-layout">
          <div className="service-list">
            {services.map((service, index) => (
              <button
                className={
                  activeService === index
                    ? "service-row is-active"
                    : "service-row"
                }
                key={service.title}
                type="button"
                onMouseEnter={() => setActiveService(index)}
                onFocus={() => setActiveService(index)}
                onClick={() => setActiveService(index)}
              >
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <article
            className="service-detail"
            aria-live="polite"
            key={services[activeService].title}
          >
            <div className="service-detail-copy">
              <h3>{services[activeService].text}</h3>
              <p>{services[activeService].detail}</p>
            </div>
            <div className="service-image">
              <img
                src={services[activeService].image}
                alt={services[activeService].alt}
              />
            </div>
          </article>
        </div>

        <div className="mobile-services">
          {services.map((service) => (
            <article className="mobile-service-card" key={service.title}>
              <div className="mobile-service-copy">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <small>{service.detail}</small>
              </div>
              <figure>
                <img src={service.image} alt={service.alt} />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="system-stage">
        <figure className="system-photo" data-reveal>
          <img
            src="/intech/data-infrastructure.jpg"
            alt="Инженерная инфраструктура крупным планом"
          />
        </figure>
        <div className="system-copy" data-reveal>
          <div className="system-copy-panel glass-panel glass-panel-dark">
            <h2>
              Внутри — <em>сложная инженерия.</em>
              <br />
              Снаружи — ясный сценарий.
            </h2>
            <p>
              Мы разделяем архитектуру, данные и пользовательский путь. Поэтому
              система может расти, а интерфейс остаётся понятным.
            </p>
          </div>
        </div>
      </section>

      <section className="case-section" id="case">
        <div className="case-top" data-reveal>
          <h2>
            Система сопоставляет{" "}
            <span>4&nbsp;500 товаров</span> с каталогами конкурентов{" "}
            <em>за минуты.</em>
          </h2>
          <p>
            Рабочее решение для Room Market ежедневно собирает предложения,
            находит аналоги при разных названиях и показывает ценовую дельту.
          </p>
        </div>

        <figure className="case-image" data-reveal>
          <img
            src="/intech/room-market-table.png"
            alt="Таблица сопоставления товаров Room Market с ценами трёх конкурентов"
          />
        </figure>

        <div className="case-results" data-reveal>
          <div>
            <strong>4&nbsp;500</strong>
            <span>товаров в каталоге</span>
          </div>
          <div>
            <strong>3</strong>
            <span>конкурента в мониторинге</span>
          </div>
          <div>
            <strong>87%</strong>
            <span>точности среди найденных товаров</span>
          </div>
          <a href="#contact">Посмотреть кейс ↗</a>
        </div>
      </section>

      <section className="process">
        <div className="section-heading" data-reveal>
          <h2>
            От проблемы
            <br />
            <em>до эксплуатации</em>
          </h2>
          <p>
            Один ответственный процесс вместо набора несвязанных подрядчиков.
            Каждая фаза заканчивается проверяемым результатом.
          </p>
        </div>

        <div className="process-layout">
          <figure className="process-visual" data-reveal>
            <img
              src="/intech/silver-architecture.jpg"
              alt="Модульная металлическая архитектура"
            />
            <blockquote>
              Архитектура должна выдерживать изменения, не усложняя ежедневную
              работу.
            </blockquote>
          </figure>
          <ol>
            <li data-reveal>
              <span>01</span>
              <div>
                <h3>Исследуем</h3>
                <p>
                  Фиксируем реальный порядок работы, участников, данные и узкие
                  места.
                </p>
              </div>
            </li>
            <li data-reveal>
              <span>02</span>
              <div>
                <h3>Проектируем</h3>
                <p>
                  Определяем сценарии, архитектуру, роли и измеримый результат.
                </p>
              </div>
            </li>
            <li data-reveal>
              <span>03</span>
              <div>
                <h3>Разрабатываем</h3>
                <p>
                  Создаём интерфейсы, backend и соединяем внешние системы.
                </p>
              </div>
            </li>
            <li data-reveal>
              <span>04</span>
              <div>
                <h3>Запускаем</h3>
                <p>
                  Тестируем на реальных данных, обучаем команду и развиваем
                  продукт.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="materials" id="materials">
        <div className="materials-title" data-reveal>
          <h2>
            Материалы для тех, кто хочет{" "}
            <em>разобраться до встречи</em>
          </h2>
          <p>
            Практические разборы автоматизации без обещаний «AI для всего».
          </p>
        </div>
        <div className="materials-grid">
          {automationArticles.map((material, index) => (
            <a
              className={`material-card material-card-${index + 1}`}
              href={`/insights/automation/${material.slug}`}
              key={material.title}
              data-reveal
            >
              <img src={material.image} alt="" aria-hidden="true" />
              <div className="material-content">
                <h3>{material.title}</h3>
                <p>{material.excerpt}</p>
                <b aria-hidden="true">↗</b>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-visual">
          <img
            src="/intech/robotic-lab.jpg"
            alt="Автоматизированное оборудование за стеклом"
          />
          <h2>
            {content?.contact?.title ?? <>
              Какой процесс отнимает у вашей команды{" "}
              <em>больше всего времени?</em>
            </>}
          </h2>
        </div>
        <form onSubmit={submitForm}>
          {sent ? (
            <div className="form-success" role="status">
              <h3>Задача принята.</h3>
              <p>В рабочей версии здесь появится подтверждение из Битрикс24.</p>
              <button type="button" onClick={() => setSent(false)}>
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <>
              <div className="form-heading">
                <h2>Расскажите о задаче</h2>
                <p>
                  {content?.contact?.text ?? "Мы разберём процесс и предложим реалистичный формат решения."}
                </p>
              </div>
              <label>
                Имя и компания
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Телефон, Telegram или email
                <input name="contact" autoComplete="email" required />
              </label>
              <label>
                Что происходит сейчас?
                <textarea name="task" rows={5} required />
              </label>
              <button className="submit-button" type="submit">
                {content?.contact?.buttonLabel ?? "Обсудить задачу"} <span aria-hidden="true">↗</span>
              </button>
              <small>
                Отправляя форму, вы соглашаетесь на обработку персональных
                данных.
              </small>
            </>
          )}
        </form>
      </section>

      <footer>
        <a className="brand" href="#top">
          ИНТЕХ
        </a>
        <p>Превращаем бизнес-задачи в работающие цифровые продукты.</p>
        <a href="#top">Наверх ↑</a>
      </footer>
    </main>
  );
}
