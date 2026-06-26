"use client";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

export default function StoreShop() {
  const { username } = useParams();
  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchStoreData = async () => {
    try {
      const { data } = await axios.get(`/api/store/data?username=${username}`);
      setStoreInfo(data.store);
      setProducts(data.store.Product);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  return !loading ? (
    <div className="min-h-[70vh] mx-6">
      {/* Store Info */}
      {storeInfo && (
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
            width={200}
            height={200}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-slate-800">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="space-y-2 text-sm text-slate-500 mt-4">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center">
                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto mb-40">
        <h1 className="text-2xl my-12">
          Shop <span className="text-slate-800 font-medium">Products</span>
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-2 py-2 border rounded ${
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
              className="px-2 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
