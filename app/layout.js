import './globals.css'; // Or whatever your CSS file is named
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
// import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display-family' });
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}