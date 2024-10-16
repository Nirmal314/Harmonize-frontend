import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./(components)/Provider";
import { Toaster } from "sonner";
import BetterHeader from "./(components)/Header/BetterHeader";
import ScrollToTop from "./(components)/Buttons/ScrollToTop";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Harmonize",
  description: "Categorize your spotify playlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Toaster
          richColors
          theme="dark"
          toastOptions={{
            classNames: {
              success: "shadow-[rgba(24,216,96,0.75)_0px_0px_6px_4px]",
              error: "shadow-[rgba(216,24,96,0.5)_0px_0px_6px_4px]",
              info: "shadow-[rgba(24,96,216,0.75)_0px_0px_6px_4px]",
              warning: "shadow-[rgba(223,182,0,0.75)_0px_0px_6px_4px]",
            },
          }}
          position="bottom-center"
          closeButton
        />
        <Provider>
          <BetterHeader />
          <main className="pt-14 h-full">
            {children}
            {/* <div className="fixed bottom-6 right-8 sm:right-14 sm:bottom-10 z-[100]">
              <ScrollToTop />
            </div> */}
          </main>
        </Provider>
      </body>
    </html>
  );
}
