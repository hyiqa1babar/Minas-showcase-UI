import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mina's Bakeshop - Animation Showcase",
  description: "An interactive, slide-based GSAP animation showcase featuring Mina's Bakeshop components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
