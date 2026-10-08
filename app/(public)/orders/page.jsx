// "use client";
// import PageTitle from "@/components/PageTitle";
// import { useEffect, useState } from "react";
// import OrderItem from "@/components/OrderItem";
// import { useAuth, useUser } from "@clerk/nextjs";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import Loading from "@/components/Loading";

// export default function Orders() {
//   const { user, isLoaded } = useUser();
//   const { getToken } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = await getToken();
//         const { data } = await axios.get("/api/orders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setOrders(data.orders);
//         setLoading(false);
//       } catch (error) {
//         toast.error(error?.response?.data?.error || error.message);
//       }
//     };
//     if (isLoaded) {
//       if (user) {
//         fetchOrders();
//       } else {
//         router.push("/");
//       }
//     }
//   }, [isLoaded, user, getToken, router]);

//   if (!isLoaded || loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="min-h-[70vh] mx-6">
//       {orders.length > 0 ? (
//         <div className="my-20 max-w-7xl mx-auto">
//           <PageTitle
//             heading="My Orders"
//             text={`Showing total ${orders.length} orders`}
//             linkText={"Go to home"}
//           />

//           <table className="w-full max-w-5xl text-white table-auto border-separate border-spacing-y-12 border-spacing-x-4">
//             <thead>
//               <tr className="max-sm:text-sm text-[#c97b63] max-md:hidden">
//                 <th className="text-left">Product</th>
//                 <th className="text-center">Total Price</th>
//                 <th className="text-left">Address</th>
//                 <th className="text-left">Status</th>
//                 <th className="text-left">Contact Seller</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <OrderItem order={order} key={order.id} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
//           <h1 className="text-2xl sm:text-4xl font-semibold">
//             You have no orders
//           </h1>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Orders() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message);
      }
    };
    if (isLoaded) {
      if (user) {
        fetchOrders();
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, user, getToken, router]);

  if (!isLoaded || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0e0a0b] px-6">
      {orders.length > 0 ? (
        <div className="py-10 max-w-7xl mx-auto">
          <PageTitle
            heading="My Orders"
            text={`Showing total ${orders.length} orders`}
            linkText="Go to home"
          />

          <div className="border border-white/8 rounded-2xl overflow-hidden mt-6">
            <table className="w-full text-white table-auto">
              <thead className="border-b border-white/8 bg-white/3">
                <tr className="max-md:hidden">
                  {[
                    "Product",
                    "Total Price",
                    "Address",
                    "Status",
                    "Contact Seller",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-[10px] tracking-[2px] uppercase text-[#c97b63] font-normal ${
                        i === 0 || i === 2 || i === 3 || i === 4
                          ? "text-left"
                          : "text-center"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 px-4">
                {orders.map((order) => (
                  <OrderItem order={order} key={order.id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
            Nothing here
          </p>
          <h1 className="text-2xl sm:text-4xl font-serif italic text-white/20">
            You have no orders yet
          </h1>
        </div>
      )}
    </div>
  );
}
