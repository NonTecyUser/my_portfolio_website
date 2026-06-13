import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display-family' });
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' });

export const metadata = {
  title: 'Samir Aryal - Portfolio',
  description: 'Full-Stack Developer & AI Enthusiast',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
