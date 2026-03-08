import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.sass";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Domatech",
    default: "Domatech | Clínica",
  },
  description: "Crie consultas e administre seus pacientes sem estresse de forma ágil e moderna com a Domatech.",
  keywords: ["clínica", "consultas", "pacientes", "nutrição", "saúde", "domatech", "medicina"],
  authors: [{ name: "Domatech" }],
  openGraph: {
    title: "Domatech | Clínica",
    description: "Crie consultas e administre seus pacientes sem estresse.",
    url: "https://domatech.com.br",
    siteName: "Domatech",
    images: [
      {
        url: "/apple-icon.png",
        width: 800,
        height: 600,
        alt: "Domatech Clínica Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon1.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
