import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1F4D2A",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: {
    default: "Grupo CISA | Desarrollo e inversión inmobiliaria en México",
    template: "%s | Grupo CISA",
  },
  description:
    "Grupo CISA convierte terrenos con potencial en desarrollos rentables. Diseño, gestión, construcción y comercialización, con la participación de quien aporta el predio.",
  metadataBase: new URL("https://grupocisa.mx"),
  openGraph: {
    title: "Grupo CISA: terrenos, desarrollos e inversión inmobiliaria",
    description:
      "Una tercera opción para su terreno: conocer su potencial de desarrollo antes de decidir.",
    locale: "es_MX",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231F4D2A'/%3E%3Cpath d='M10 16 L22 16' stroke='%238BC34A' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M16 10 L16 22' stroke='%238BC34A' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SkipLink />
        <SiteHeader />
        <main id="main" style={{ flex: 1 }}>{children}</main>
        <SiteFooter />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
