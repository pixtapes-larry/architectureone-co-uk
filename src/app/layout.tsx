import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Architecture ONE",
  description:
    "Award-winning residential architecture across the East of England — extensions, loft conversions and new builds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <SiteHeader />
        <main style={{ flex: 1 }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
