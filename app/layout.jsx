import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Lays Scent - Luxury Fragrances for Every Story",
  description:
    "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
