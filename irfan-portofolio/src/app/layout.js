import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Irfan Rahmanindra | Full Stack Software Engineer",
    template: "%s | Irfan Rahmanindra",
  },
  description:
    "Irfan Rahmanindra is a full stack software engineer in Jakarta, building scalable web applications and enterprise systems.",
  keywords: [
    "Irfan Rahmanindra",
    "full stack software engineer",
    "IT specialist",
    "software engineer Jakarta",
    "web application developer",
  ],
  authors: [{ name: "Irfan Rahmanindra" }],
  creator: "Irfan Rahmanindra",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Irfan Rahmanindra",
    url: "/home",
    title: "Irfan Rahmanindra | Full Stack Software Engineer",
    description:
      "Portfolio of Irfan Rahmanindra, a full stack software engineer building scalable enterprise software and modern web applications.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Irfan Rahmanindra, Full Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Irfan Rahmanindra | Full Stack Software Engineer",
    description:
      "Portfolio of Irfan Rahmanindra, a full stack software engineer building scalable enterprise software and modern web applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-black">
        <ThemeProvider>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Irfan Rahmanindra",
                jobTitle: "Full Stack Software Engineer",
                url: process.env.NEXT_PUBLIC_SITE_URL,
                sameAs: [
                  "https://github.com/irfandra",
                  "https://linkedin.com/in/irfan-rahmanindra-35a714154/",
                ],
              }),
            }}
          />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
