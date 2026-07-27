import type { Metadata } from "next";
import { HeroWebglPage } from "../hero-webgl/hero-webgl-page";

export const metadata: Metadata = {
  title: "Интерактивный WebGL hero — вариант 2",
  description:
    "Полноэкранный вариант WebGL hero ИНТЕХ с центрированным заголовком.",
};

export default function HeroWebglVariantTwoRoute() {
  return <HeroWebglPage variant="full" />;
}
