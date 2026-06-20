import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "../components/dashboard/SessionProvider";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollingMarquee } from "@/components/layout/ScrollingMarquee";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matt Project Solutions | Premium Engineering & IT Academic Projects",
  description: "Since 2014, Matt Project Solutions provides the highest quality academic projects for BE, BTech, ME, MTech, and Diploma students. Experts in Web Dev, AI, ML, Python, Java, Blockchain, and IoT.",
  keywords: "Matt Project Solutions, academic projects Nagercoil, engineering projects Tamil Nadu, final year projects for ECE, CSE, EEE, IT, AI ML projects, blockchain student projects, python project solutions, IoT mini projects, ME MTech project help, project documentation services, student project portal",
  authors: [{ name: "Matt Project Solutions" }],
  creator: "Matt Project Solutions",
  publisher: "Matt Project Solutions",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Matt Project Solutions | Engineering & IT Project Excellence",
    description: "Empowering students with industry-standard project development and expert clinical guidance since 2014.",
    url: "https://mattprojects.com",
    siteName: "Matt Project Solutions",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Matt Project Solutions Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Project Solutions | Premier Project Development",
    description: "Industry-grade academic projects for engineering and IT students.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {/* Fixed Navbar & Info Bar */}
            <Navbar />
            <ScrollingMarquee />

            {/* Main Content with padding to account for fixed navbar + marquee */}
            <main className="min-h-screen pt-28">
              {children}
            </main>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
