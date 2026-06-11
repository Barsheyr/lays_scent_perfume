import StoreLayout from "@/components/store/StoreLayout";
import { Show, SignInButton } from "@clerk/nextjs";

export const metadata = {
  title: "Lays Scent - Luxury Fragrances for Every Story",
  description:
    "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
};

export default function RootStoreLayout({ children }) {
  return (
    <>
      <Show when="signed-in">
        <StoreLayout>{children}</StoreLayout>
      </Show>
      <Show when="signed-out">
        <div className="min-h-screen bg-[#0e0a0b] flex items-center justify-center">
          <SignInButton />
        </div>
      </Show>
    </>
  );
}
