import type { Metadata, Viewport } from "next";
import { ArcanaProvider } from "@/contexts/arcana-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCANA - Sua Biblioteca Local",
  metadataBase: new URL("https://arcana-ruddy.vercel.app"),
  description: "Salve seus prompts e fragmentos de código com total privacidade!",
  keywords: ["Código", "Open Source", "Prompts", "Segurança", "Programação", "Produtividade", "Offline-first", "Privacidade", "Arcana", "Dev Tools", "Notes", "Anotações", "Ogranização", "Desenvolvimento", "Software", "Tecnologia", "Armazenamento local", "Biblioteca de código", "Fragmentos de código", "Gerenciamento de conhecimento", "Desenvolvedores", "Programadores"],
  authors: [{ name: "Valthre", url: "https://github.com/Valthre" }],
  manifest: "/manifest.json",
  verification: {
    google: "kz4Auk5ae1tiNiRKB8R7hvG7uWNG1h2N1AXub_2a1Sc",
  },
  openGraph: {
    title: "ARCANA - Sua Biblioteca Local",
    description: "Tenha privacidade e controle sobre seus códigos.",
    url: "https://arcana-ruddy.vercel.app",
    siteName: "Arcana",
    images: [
      {
        url: "/images/logo-do-app.jpg",
        width: 1200,
        height: 630,
        alt: "Arcana Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/images/icon (512px).png",
    apple: "/images/icon (512px).png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a1f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden font-sans antialiased" suppressHydrationWarning>
        <ArcanaProvider>{children}</ArcanaProvider>
      </body>
    </html>
  );
}