// import { Outfit } from "next/font/google";
// import { Toaster } from "react-hot-toast";
// import StoreProvider from "@/app/StoreProvider";
// import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs";

// const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

// export const metadata = {
//   title: "Lays Scent - Luxury Fragrances for Every Story",
//   description:
//     "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body
//           className={`${outfit.className} antialiased bg-[#0e0a0b]`}
//           suppressHydrationWarning
//         >
//           <StoreProvider>
//             <Toaster />
//             {children}
//           </StoreProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }

import { Outfit } from "next/font/google";
import StoreProvider from "@/app/StoreProvider";
import ToasterProvider from "@/components/ToasterProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

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
          className={`${outfit.className} antialiased bg-[#0e0a0b]`}
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
