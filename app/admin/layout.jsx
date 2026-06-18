import AdminLayout from "@/components/admin/AdminLayout";
import { Show, SignInButton } from "@clerk/nextjs";

export const metadata = {
  title: "Lays Scent - Luxury Fragrances for Every Story",
  description:
    "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <Show when="signed-in">
        <AdminLayout>{children}</AdminLayout>
      </Show>
      <Show when="signed-out">
        <div className="min-h-screen bg-[#0e0a0b] flex items-center justify-center">
          <SignInButton />
        </div>
      </Show>
    </>
  );
}
