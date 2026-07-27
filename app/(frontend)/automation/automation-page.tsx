"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArcCarousel } from "./arc-carousel";
import { automationArticles, automationVisuals } from "./data";
import { SiteNavigation } from "../site-navigation";
import type { AutomationCmsContent } from "@/lib/cms-content";
import { trackLeadSubmission } from "@/lib/analytics";
import { CmsRichText, hasCmsRichText } from "@/components/CmsRichText";
import {
  IconApi,
  IconArrowDownRight,
  IconArrowRight,
  IconArrowUp,
  IconArrowUpRight,
  IconBranch,
  IconCard,
  IconChart,
  IconCheck,
  IconCrm,
  IconDocument,
  IconFilter,
  IconGlobe,
  IconInbox,
  IconPerson,
  IconPlus,
} from "./icons";

const problems = [
  ["Заявки приходят из разных каналов и теряются", "Входящие в почте, Telegram и на сайте", "Единый маршрут, статус и ответственный"],
  ["Сотрудники вручную переносят данные между системами", "Копирование в CRM, таблицы и 1С", "Данные передаются автоматически"],
  ["Статусы задач живут в чатах и таблицах", "Уточнения и поиск последней версии", "Прозрачный процесс в одной системе"],
  ["Отчёты собираются вручную и всегда запаздывают", "Сверка данных перед каждым отчётом", "Показатели обновляются по правилам"],
  ["Документы согласуются через почту и мессенджеры", "Файлы, версии и решения разбросаны", "Согласование с маршрутом и историей"],
  ["Системы работают отдельно и не синхронизируются", "Разрозненные сервисы и дублирование", "Связанный цифровой контур"],
] as const;

const processFlow = ["Сайт / Telegram / CRM", "Обработка данных", "Бизнес-логика", "Ответственный сотрудник", "Документы и платежи", "Аналитика руководителя"];

/** Короткие пояснения к этапам потока: показывают связь соседних шагов. */
const flowMeta = [
  { caption: "Обращение появляется в любом канале", Icon: IconInbox },
  { caption: "Приводим данные к единому виду", Icon: IconFilter },
  { caption: "Правила решают, что делать дальше", Icon: IconBranch },
  { caption: "Задача уходит конкретному человеку", Icon: IconPerson },
  { caption: "Формируются без ручного ввода", Icon: IconDocument },
  { caption: "Показатели обновляются сами", Icon: IconChart },
] as const;

/** Системы для блока интеграций: логотип или иконка + подпись. */
const integrationSystems: { name: string; logo?: string; wordmark?: boolean; Icon?: typeof IconGlobe; note: string }[] = [
  { name: "1С", logo: "/logos/1c.svg", wordmark: true, note: "Учёт и документы" },
  { name: "Битрикс24", logo: "/logos/bitrix24.svg", wordmark: true, note: "CRM и задачи" },
  { name: "iiko", logo: "/logos/iiko.svg", note: "Ресторанные процессы" },
  { name: "Telegram", logo: "/logos/telegram.svg", note: "Заявки и уведомления" },
  { name: "Excel", logo: "/logos/excel.svg", note: "Выгрузки и реестры" },
  { name: "Google Sheets", logo: "/logos/google-sheets.svg", note: "Совместные таблицы" },
  { name: "CRM", Icon: IconCrm, note: "Любая система продаж" },
  { name: "Сайты", Icon: IconGlobe, note: "Формы и личные кабинеты" },
  { name: "Платежи", Icon: IconCard, note: "Онлайн-оплата и счета" },
  { name: "API", Icon: IconApi, note: "Обмен между сервисами" },
  { name: "BI", Icon: IconChart, note: "Отчёты и дашборды" },
];

const cases: NonNullable<AutomationCmsContent["cases"]> = [
  { name: "Stat", title: "Автоматизация строительных закупок", text: "Заявки, предложения поставщиков, сравнение цен и условий, коммуникация, статусы и аналитика закупок в одной платформе.", image: automationVisuals.systems },
  { name: "Atera", title: "Онлайн-продажи ресторана", text: "Telegram Mini App, интеграция с iiko, оформление и передача заказов, допродажи, онлайн-оплата и повторные покупки.", image: automationVisuals.sales },
  { name: "Апселло", title: "Система лояльности", text: "Клиентская база, бонусные программы, сегментация, история заказов, персональные предложения и аналитика эффективности.", image: automationVisuals.requests },
];

const facts = [
  ["Полный цикл", "От исследования проблемы и прототипа до разработки, интеграций и запуска."],
  ["3+ продуктовых направления", "B2B-платформы, ресторанные сервисы, лояльность, аналитика и AI-модули."],
  ["Web + mobile", "Веб-платформы, адаптивные интерфейсы и мобильные приложения."],
  ["Сложные интеграции", "CRM, 1С-Битрикс, iiko, Telegram, платежи, аналитика и API."],
  ["Реальные запуски", "Пилоты, коммерческое использование и развитие после запуска."],
  ["Бизнес-партнёр 1С-Битрикс", "Экспертиза в экосистеме и внедрении связанных бизнес-процессов."],
];

const stages = [
  ["Аудит", "Карта процесса, ручные операции, проблемы и точки автоматизации."],
  ["Проектирование", "Прототип, роли, бизнес-логика и интеграционная схема."],
  ["Внедрение", "Работающий сценарий, подключённые системы и перенос данных."],
  ["Запуск", "Обучение, документация, метрики и план развития."],
];

/** Что остаётся у клиента после каждого этапа. */
const stageOutcomes = [
  "Карта процесса и список точек автоматизации",
  "Утверждённая схема решения и прототип",
  "Работающий сценарий в боевых данных",
  "Команда работает в системе, есть план развития",
];

const deliveryFormats = [
  ["Диагностика процесса", "Анализ текущей схемы и целесообразности автоматизации.", automationVisuals.process],
  ["Прототип или пилот", "Проверка одного сценария без полной перестройки инфраструктуры.", automationVisuals.requests],
  ["Полное внедрение", "Разработка, интеграции, перенос данных и запуск.", automationVisuals.sales],
  ["Развитие продукта", "Новые модули, аналитика, AI-функции и сопровождение.", automationVisuals.systems],
] as const;

const pricing = [
  ["Автоматизация одного процесса", "Один ключевой сценарий, базовая бизнес-логика, интерфейс и необходимые интеграции.", "От 100 000 ₽"],
  ["Интеграция нескольких систем", "Связь CRM, сайта, 1С, мессенджеров, платежей или внутренних сервисов.", "После технического аудита"],
  ["Цифровой продукт под ключ", "Проектирование, разработка, аналитика, интеграции, запуск и развитие.", "Индивидуальная оценка"],
] as const;

/** Состав пакета и финальный результат — главное отличие предложений. */
const pricingDetails = [
  {
    tag: "Один процесс",
    priceNote: "фиксированная смета после аудита",
    includes: ["Аудит одного процесса", "Бизнес-логика, роли и права", "Интерфейс для сотрудников", "1–2 интеграции", "Обучение команды"],
    result: "Один процесс работает без ручных операций: у каждой задачи есть статус, ответственный и история.",
    featured: false,
  },
  {
    tag: "Связанный контур",
    priceNote: "оценка по схеме обмена данными",
    includes: ["Схема обмена между системами", "Связь CRM, 1С, сайта и мессенджеров", "Правила и частота синхронизации", "Обработка ошибок обмена", "Мониторинг интеграций"],
    result: "Системы обмениваются данными сами — сотрудники перестают переносить их руками и сверять таблицы.",
    featured: true,
  },
  {
    tag: "Продукт под ключ",
    priceNote: "оценка по объёму продукта",
    includes: ["Исследование и прототип", "Проектирование и дизайн", "Разработка web и mobile", "Интеграции и аналитика", "Запуск, поддержка и развитие"],
    result: "Собственная система под процессы компании: единые данные, аналитика для руководителя и план развития.",
    featured: false,
  },
] as const;

const reviews = [
  ["Александр, строительная компания", "У нас заявки, предложения поставщиков и согласование были в таблицах и чатах. После совместной работы появился понятный процесс, в котором видно статус каждой закупки."],
  ["Алексей, ресторанный бизнес", "Новый интерфейс удалось встроить в существующую инфраструктуру без лишней перестройки. Команде стало проще работать с заказами и повторными обращениями."],
  ["Мария, сервисный бизнес", "Начали с одного сценария, а затем добавили аналитику и новые модули. Это позволило развивать систему постепенно и без лишних рисков."],
] as const;

const faq = [
  ["Нужно ли заменять CRM или 1С?", "Нет. Чаще мы связываем уже используемые сервисы и добавляем недостающие правила, интерфейсы и интеграции."],
  ["Можно автоматизировать только один процесс?", "Да. Нередко начинаем с одного сценария, чтобы проверить решение и получить основу для следующих этапов."],
  ["Когда можно запустить первый сценарий?", "Срок зависит от процесса и интеграций. После аудита можно определить объём работ и реалистичный план первого запуска."],
  ["Можно ли начать с прототипа?", "Да. Прототип или пилот помогает проверить логику и роль систем до полного внедрения."],
  ["Что делать со старыми внутренними системами?", "Оцениваем их роль в процессе и, если это возможно, подключаем через API, обмен файлами или промежуточный слой интеграции."],
  ["Что происходит после запуска?", "Передаём документацию, обучаем команду, следим за первыми сценариями и при необходимости развиваем решение."],
] as const;

/**
 * Мягкое появление блоков при скролле. Одно наблюдение на страницу,
 * при prefers-reduced-motion элементы сразу показываются без анимации.
 */
function useReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((node) => node.setAttribute("data-reveal", "shown"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

export function AutomationPage({
  content,
}: {
  content?: AutomationCmsContent;
}) {
  const [sent, setSent] = useState(false);
  const pageHero = content?.hero;
  const PrimaryHeading = content?.primaryHeadingTag ?? "h1";
  const pageHeadings = content?.headings;
  const pageDirections = content?.directions ?? automationArticles;
  const pageCases = content?.cases ?? cases;
  const pageFacts = content?.facts ?? facts;
  const pageStages = content?.stages ?? stages;
  const pageReviews = content?.reviews ?? reviews;
  const pageProblems = content?.problems ?? problems;
  const pageFlow = content?.flow;
  const pageFormats = content?.formats?.items ?? deliveryFormats.map(([title, text, image]) => ({ title, text, image }));
  const pageProducts = content?.products ?? pricing.map(([title, text, price]) => ({ title, text, price }));
  const pageFaq = content?.faq?.items ?? faq;

  useReveal();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/lead-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), contact: form.get("contact"), message: form.get("message"), source: "Автоматизация", utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"), utmTerm: params.get("utm_term"), utmContent: params.get("utm_content"), landingPage: window.location.href, referrer: document.referrer }) });
    if (response.ok) { trackLeadSubmission(); setSent(true); }
  }

  return (
    <main className="automation-page" id="top">
      <SiteNavigation active="automation" />

      <section className="automation-hero">
        <img src={pageHero?.image ?? automationVisuals.hero} alt="Современная технологическая среда" />
        <span className="automation-hero-light" aria-hidden="true" />
        <div className="automation-hero-copy">
          {hasCmsRichText(pageHero?.titleRichText) ? <CmsRichText value={pageHero?.titleRichText} className="page-primary-heading rich-text-heading" /> : <PrimaryHeading className="page-primary-heading">Автоматизируем процессы — от первого действия до управленческого решения.</PrimaryHeading>}
          <div className="automation-hero-bottom">
            {hasCmsRichText(pageHero?.textRichText) ? <CmsRichText value={pageHero?.textRichText} className="rich-text-copy" /> : <p>Связываем CRM, 1С, сайты, мессенджеры и внутренние сервисы. Убираем ручные операции и показываем руководителю актуальные данные.</p>}
            <div className="automation-hero-actions">
              <a href={pageHero?.primaryUrl ?? "#contact"} className="ui-button ui-button--light">{pageHero?.primaryLabel ?? "Разобрать мой процесс"} <IconArrowDownRight /></a>
              <a href={pageHero?.secondaryUrl ?? "#cases"} className="ui-button ui-button--outline">{pageHero?.secondaryLabel ?? "Посмотреть кейсы"} <IconArrowRight /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="automation-problems" id="problems">
        <h2>{pageHeadings?.problems ?? "Узнаёте один из этих сценариев?"}</h2>
        <div className="automation-problem-grid">
          {pageProblems.map(([title, before, after], index) => (
            <article className="automation-problem-card" key={title} data-reveal="hidden">
              <div className="automation-problem-top">
                <span className="automation-problem-index">0{index + 1}</span>
                <span className="automation-problem-rule" aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <div className="automation-shift">
                <p className="automation-shift-before"><b>Было</b><span>{before}</span></p>
                <span className="automation-shift-arrow" aria-hidden="true"><IconArrowRight /></span>
                <p className="automation-shift-after"><b>Стало</b><span>{after}</span></p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="automation-directions" id="directions">
        <div className="automation-section-intro">
          <h2>{content?.directionsIntro?.title ?? pageHeadings?.directions ?? <>Направления <em>автоматизации</em></>}</h2>
          <p>{content?.directionsIntro?.text ?? "Выберите процесс, который хотите изменить. Карточка откроет материал с полным текстом услуги."}</p>
        </div>
        <ArcCarousel articles={pageDirections} />
      </section>

      <section className="automation-flow" id="flow">
        <div className="automation-flow-heading"><h2>{pageFlow?.title ?? "Как данные превращаются в управляемый процесс"}</h2><p>{pageFlow?.text ?? "Мы не обязательно заменяем существующие системы. Часто достаточно связать их, убрать ручные операции и добавить единый управляющий контур."}</p></div>
        <ol className="automation-flow-track">
          {(pageFlow?.items ?? processFlow).map((item, index, items) => {
            const meta = flowMeta[index] ?? flowMeta[flowMeta.length - 1];
            const StepIcon = meta.Icon;
            return (
              <li className="automation-flow-step" key={item} data-reveal="hidden">
                <span className="automation-flow-rail" aria-hidden="true">
                  <i className="automation-flow-node" />
                  {index < items.length - 1 && <i className="automation-flow-line" />}
                </span>
                <span className="automation-flow-card">
                  <span className="automation-flow-head">
                    <span className="automation-flow-icon" aria-hidden="true"><StepIcon /></span>
                    <span className="automation-flow-index">{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <strong>{item}</strong>
                  <span className="automation-flow-caption">{meta.caption}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="automation-cases" id="cases">
        <div className="automation-section-intro"><h2>{content?.casesIntro?.title ?? "Автоматизация в работающих продуктах"}</h2><p>{content?.casesIntro?.text ?? "Примеры направлений, где автоматизация становится частью ежедневной работы бизнеса."}</p></div>
        <div className="automation-case-grid">
          {pageCases.map((item) => (
            <article key={item.name}>
              <img src={item.image} alt="" />
              <div>
                <p>{item.name}</p>
                <h3>{item.title}</h3>
                <span>{item.text}</span>
                {item.url ? (
                  <a href={item.url}>
                    Смотреть кейс <IconArrowUpRight />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Кейс готовится к публикации"
                  >
                    Смотреть кейс <IconArrowUpRight />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="automation-facts" id="facts">
        <h2>{content?.factsIntro?.title ?? "Не просто внедряем сервисы — создаём работающие цифровые продукты"}</h2>
        <div>{pageFacts.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="automation-integrations" id="integrations">
        <h2>{content?.integrations?.title ?? "Работаем поверх уже используемых систем"}</h2>
        <p>{content?.integrations?.text ?? "Не обязательно заменять всю инфраструктуру. Мы подключаемся к существующим сервисам и создаём недостающие интеграции, интерфейсы и правила работы."}</p>
        <ul className="automation-system-grid">
          {integrationSystems.map(({ name, logo, wordmark, Icon, note }) => (
            <li className="automation-system-card" key={name} data-reveal="hidden">
              <span className="automation-system-mark">
                {logo ? <img src={logo} alt="" data-wordmark={Boolean(wordmark)} loading="lazy" /> : Icon ? <Icon /> : null}
              </span>
              <span className="automation-system-name">{name}</span>
              <span className="automation-system-note">{note}</span>
            </li>
          ))}
          <li className="automation-system-card automation-system-card--empty" data-reveal="hidden">
            <span className="automation-system-mark"><IconPlus /></span>
            <span className="automation-system-name">Ваша система</span>
            <span className="automation-system-note">Подключим через API или обмен</span>
          </li>
        </ul>
      </section>

      <section className="automation-stages" id="stages">
        <div className="automation-section-intro"><h2>{content?.stagesIntro?.title ?? "От процесса к работающему результату"}</h2><p>{content?.stagesIntro?.text ?? "Проект строится последовательно: каждое решение имеет понятный результат для следующего этапа."}</p></div>
        <ol className="automation-stage-track">
          {pageStages.map(([title, text], index, items) => (
            <li className="automation-stage" key={title} data-reveal="hidden">
              <span className="automation-stage-rail" aria-hidden="true">
                <i className="automation-stage-node">{String(index + 1).padStart(2, "0")}</i>
                {index < items.length - 1 && <i className="automation-stage-line" />}
              </span>
              <div className="automation-stage-body">
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="automation-stage-outcome">
                  <IconCheck />
                  <span>{stageOutcomes[index] ?? "Результат этапа зафиксирован"}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="automation-formats" id="formats">
        <div className="automation-formats-heading"><h2>{content?.formats?.title ?? "Можно начать с одного процесса"}</h2><p>{content?.formats?.text ?? "Выбираем формат по текущей задаче и степени готовности команды к изменениям."}</p></div>
        <div className="automation-format-list">
          {pageFormats.map(({ title, text, image }) => <article key={title}><img src={image} alt="" /><div className="automation-format-copy"><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>

      <section className="automation-pricing" id="pricing">
        <div className="automation-pricing-heading">
          <h2>{content?.pricing?.title ?? "Стоимость автоматизации"}</h2>
          <p>Три формата работы. Отличаются глубиной задачи, составом работ и тем, что вы получаете на выходе.</p>
        </div>
        <div className="automation-pricing-grid">
          {pageProducts.map(({ title, text, price }, index) => {
            const details = pricingDetails[index] ?? pricingDetails[pricingDetails.length - 1];
            return (
              <article key={title} data-featured={details.featured} data-reveal="hidden">
                <div className="automation-plan-top">
                  <span className="automation-plan-tag">{details.tag}</span>
                  {details.featured && <span className="automation-plan-badge">Чаще всего выбирают</span>}
                </div>
                <h3>{title}</h3>
                <p className="automation-plan-text">{text}</p>
                <div className="automation-plan-price">
                  <b>{price}</b>
                  <span>{details.priceNote}</span>
                </div>
                <ul className="automation-plan-list">
                  {details.includes.map((item) => (
                    <li key={item}><IconCheck /><span>{item}</span></li>
                  ))}
                </ul>
                <div className="automation-plan-result">
                  <span className="automation-plan-result-label">Что вы получите на выходе</span>
                  <p>{details.result}</p>
                </div>
                <a className="ui-button ui-button--plan" href="#contact">Обсудить формат <IconArrowUpRight /></a>
              </article>
            );
          })}
        </div>
        <div className="automation-pricing-footer"><p>{content?.pricing?.footerText ?? "Для предварительной оценки достаточно описать текущий процесс, используемые системы и желаемый результат."}</p><a href={content?.pricing?.buttonUrl ?? "#contact"} className="ui-button ui-button--dark">{content?.pricing?.buttonLabel ?? "Получить предварительную оценку"} <IconArrowDownRight /></a></div>
      </section>

      <section className="automation-reviews" id="reviews">
        <h2>{content?.reviewsIntro?.title ?? "Что говорят о работе с ИНТЕХ"}</h2>
        <div>{pageReviews.map(([name, quote]) => <figure key={name}><blockquote>«{quote}»</blockquote><figcaption>{name}</figcaption></figure>)}</div>
      </section>

      <section className="automation-faq" id="faq">
        <h2>{content?.faq?.title ?? "Частые вопросы"}</h2>
        <div>{pageFaq.map(([question, answer]) => <details key={question}><summary>{question}<span className="automation-faq-toggle" aria-hidden="true"><IconPlus /></span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="automation-contact" id="contact">
        <div className="automation-contact-copy"><h2>{content?.contact?.title ?? "Какой процесс отнимает у команды"} <em>{content?.contact?.accent ?? "больше всего времени?"}</em></h2><p>{content?.contact?.text ?? "Опишите текущий процесс в нескольких предложениях. Мы разберём его и определим, какие операции можно автоматизировать."}</p></div>
        <form className="automation-contact-form" onSubmit={submit}>
          <label>Имя<input required name="name" autoComplete="name" placeholder="Как к вам обращаться" /></label>
          <label>Телефон или почта<input required name="contact" autoComplete="tel" placeholder="Для связи" /></label>
          <label>Коротко о задаче<textarea required name="message" rows={5} placeholder="Например: заявки приходят из Telegram и почты, сотрудники вручную переносят их в CRM, а руководитель не видит актуальные статусы." /></label>
          <div className="automation-form-footer"><small>{content?.contact?.note ?? "Ответим в течение рабочего дня. На первой встрече разберём текущую схему и определим, есть ли смысл в автоматизации."}</small><div><button type="submit">{sent ? (content?.contact?.successLabel ?? "Заявка отправлена") : (content?.contact?.submitLabel ?? "Получить разбор процесса")} <IconArrowUpRight /></button><button type="button" disabled title="Контакт Telegram добавим после подтверждения">{content?.contact?.telegramLabel ?? "Написать в Telegram"}</button></div></div>
        </form>
      </section>

      <footer className="automation-footer"><Link href="/">ИНТЕХ</Link><span>{content?.footer?.tagline ?? "Автоматизация бизнеса и цифровые системы"}</span><a href="#top" className="automation-footer-top">Наверх <IconArrowUp /></a></footer>
    </main>
  );
}
