"use client";
import { Suspense, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

function ShopContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const router = useRouter();

  const products = useSelector((state) => state.product.list);

  // This ensures hooks don't break
  const showLoader = !products || products.length === 0;

  const filteredProducts = useMemo(() => {
    if (showLoader) return [];
    return search
      ? products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      : products;
  }, [products, search, showLoader]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0e0a0b]">
      <div className="max-w-7xl mx-auto py-20">
        {/* Loader FIRST */}
        {showLoader ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Title */}
            <h1
              onClick={() => router.push("/shop")}
              className="text-2xl text-white  flex items-center pb-20 gap-2 cursor-pointer"
            >
              {search && <MoveLeftIcon size={20} />} All
              <span className="text-white font-medium">Products</span>
            </h1>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:px-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-24">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === i + 1
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
