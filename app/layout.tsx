import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AIFarmProvider } from '@/context/AIFarmContext';
import { AuthProvider } from '@/components/auth/AuthProvider';

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
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001'} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider defaultTheme="dark">
            <AIFarmProvider>
              <ErrorBoundary fallback={<SkeletonCard className="max-w-xl mx-auto mt-24" lines={6} />}>
                <SidebarLayout>{children}</SidebarLayout>
              </ErrorBoundary>
            </AIFarmProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
