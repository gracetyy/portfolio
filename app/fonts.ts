import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const museoModerno = localFont({
  src: "./local-fonts/MuseoModerno-Variable.ttf",
  variable: "--font-museo",
  display: "swap",
  weight: "100 900",
});
