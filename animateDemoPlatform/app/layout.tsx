import type { Metadata, Viewport } from 'next';
import './globals.css';
import Registry from './registry';

export const metadata: Metadata = {
  title: 'Animation Demo Platform',
  description: 'Universal Animation Platform with Reanimated and GSAP',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
