"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationKey = "home" | "automation" | "articles" | "webgl" | "webgl-v2";

const navigationLinks: { key: NavigationKey; href: string; label: string }[] = [
  { key: "home", href: "/", label: "Главная" },
  { key: "automation", href: "/automation", label: "Автоматизация" },
  { key: "articles", href: "/automation#directions", label: "Статьи" },
  { key: "webgl", href: "/hero-webgl", label: "WebGL I" },
  { key: "webgl-v2", href: "/hero-webgl-v2", label: "WebGL II" },
];

type SiteNavigationProps = {
  active?: NavigationKey;
  dark?: boolean;
};

export function SiteNavigation({ active, dark = false }: SiteNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerClassName = dark ? "site-header site-header--dark" : "site-header";
  const menuClassName = ["mobile-menu", menuOpen && "is-open", dark && "mobile-menu--dark"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClassName}>
        <Link className="brand" href="/" aria-label="ИНТЕХ — на главную">
          ИНТЕХ
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigationLinks.map((link) => (
            <Link href={link.href} key={link.key} aria-current={active === link.key ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="header-action" href="/#contact">
          Обсудить задачу
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Закрыть" : "Меню"}
        </button>
      </header>

      <div className={menuClassName} id="site-mobile-menu">
        {navigationLinks.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            aria-current={active === link.key ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/#contact" onClick={() => setMenuOpen(false)}>
          Обсудить задачу
        </Link>
      </div>
    </>
  );
}
