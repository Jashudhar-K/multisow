import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { ThemeProvider } from '@/components/theme';

// Typography: DM Sans for body, Inter for display headings
const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'MultiSow — AI-Powered Multi-Tier Intercropping',
  description:
    'Design the perfect 4-layer intercropping system for your land with stratified AI. Maximise yield, minimise resource waste.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <meta name="description" content="Design the perfect 4-layer intercropping system for your land with stratified AI. Maximise yield, minimise resource waste." />
        <meta property="og:title" content="MultiSow — AI-Powered Multi-Tier Intercropping" />
        <meta property="og:description" content="Design the perfect 4-layer intercropping system for your land with stratified AI. Maximise yield, minimise resource waste." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://multisow.com/" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MultiSow — AI-Powered Multi-Tier Intercropping" />
        <meta name="twitter:description" content="Design the perfect 4-layer intercropping system for your land with stratified AI. Maximise yield, minimise resource waste." />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="dark">
          <ErrorBoundary fallback={<SkeletonCard className="max-w-xl mx-auto mt-24" lines={6} />}>
            <SidebarLayout>{children}</SidebarLayout>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
