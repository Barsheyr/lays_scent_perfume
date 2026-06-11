import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
  title: "Lays Scent - Luxury Fragrances for Every Story",
  description:
    "Discover premium perfumes for her, him, and everyone in between. Shop exclusive fragrances at Lays Scent.",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <StoreLayout>{children}</StoreLayout>
    </>
  );
}
