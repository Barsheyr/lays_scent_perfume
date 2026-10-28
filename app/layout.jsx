// Outfit font bundled with the app (no Google Fonts download at build time)
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import StoreProvider from "@/app/StoreProvider";
import ToasterProvider from "@/components/ToasterProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Lays Scent - Luxury Fragrances for Every Story",
  description:
    "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className="antialiased bg-[#0e0a0b]"
          style={{ fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" }}
          suppressHydrationWarning
        >
          <StoreProvider>
            <ToasterProvider />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
