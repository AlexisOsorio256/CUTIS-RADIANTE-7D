import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cutis Radiante 7D · Cosmética artesanal",
  description:
    "Kit de cuidado facial artesanal: crema reparadora, jabón, exfoliante de arroz, ultra master aclarante y bloqueador FPS 75. Pide por WhatsApp.",
  openGraph: {
    title: "Cutis Radiante 7D · Cosmética artesanal",
    description:
      "Belleza, cuidado y luminosidad. Productos artesanales con ingredientes naturales. Pide por WhatsApp.",
    type: "website",
    locale: "es_CO",
  },
  icons: { icon: "/images/crema-reparadora-etiqueta.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} font-sans`}>{children}</body>
    </html>
  );
}
