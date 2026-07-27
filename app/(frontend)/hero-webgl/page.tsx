import type { Metadata } from "next";
import { HeroWebglPage } from "./hero-webgl-page";

export const metadata: Metadata = {
  title: "Интерактивный WebGL hero",
  description:
    "Экспериментальный первый экран ИНТЕХ с интерактивной цифровой поверхностью.",
};

export default function HeroWebglRoute() {
  return <HeroWebglPage />;
}
