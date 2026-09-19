import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MedFlow | Sistema de Gestión de Incapacidades',
  description:
    'Plataforma integral enterprise para la administración, transcripción y cobro de incapacidades médicas.',
  keywords: [
    'incapacidades',
    'gestión médica',
    'salud ocupacional',
    'EPS',
    'ARL',
    'enterprise',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#2563eb] selection:text-white">
        {children}
      </body>
    </html>
  );
}
