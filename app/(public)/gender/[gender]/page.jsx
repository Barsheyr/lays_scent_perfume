"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  const { gender } = useParams();
  const products = useSelector((state) => state.product.list);

  // Filter products that match this gender
  const genderProducts = products.filter(
    (p) => p.gender.toLowerCase() === gender.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 capitalize">
          {gender} Perfumes
        </h1>
        <Link href="/shop" className="hover:underline">
          Shop
        </Link>
      </div>

      {genderProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genderProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="rounded-lg p-3 transition group"
            >
              <div className="flex justify-center items-center">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="group-hover:scale-105 transition-transform rounded-lg h-50 lg:h-80"
                />
              </div>
              <p className="mt-2 text-sm text-white font-medium">{item.name}</p>
              <p className="text-white text-sm">
                ₦{item.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products found in this category.</p>
      )}
    </div>
  );
};

export default page;
