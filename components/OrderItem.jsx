// "use client";
// import Image from "next/image";
// import { DotIcon } from "lucide-react";
// import { useSelector } from "react-redux";
// import Rating from "./Rating";
// import { useState } from "react";
// import RatingModal from "./RatingModal";

// const OrderItem = ({ order }) => {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
//   const [ratingModal, setRatingModal] = useState(null);
//   const { ratings } = useSelector((state) => state.rating);

//   // ✅ Build a single WhatsApp message for the whole order
//   const sellerPhone = "+2347084775311";

//   const productList = order.orderItems
//     .map(
//       (item, index) =>
//         `${index + 1}. ${item.product.name}\n   - Quantity: ${
//           item.quantity
//         }\n   - Price: ${currency}${item.price} each`,
//     )
//     .join("\n");

//   const totalAmount = `${currency}${order.total}`;

//   const message = `Hello! I'm interested in purchasing the following items from your store:\n\n${productList}\n\nTotal Amount: ${totalAmount}\n\nDelivery Address:\n${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}\n\nPlease let me know how I can proceed with the payment.`;

//   const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(
//     message,
//   )}`;

//   return (
//     <>
//       <tr className="text-sm">
//         <td className="text-left">
//           <div className="flex flex-col gap-6">
//             {order.orderItems.map((item, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
//                   <Image
//                     className="h-14 w-auto"
//                     src={item.product.images[0]}
//                     alt="product_img"
//                     width={50}
//                     height={50}
//                   />
//                 </div>
//                 <div className="flex flex-col justify-center text-sm">
//                   <p className="font-medium text-slate-600 text-base">
//                     {item.product.name}
//                   </p>
//                   <p>
//                     {currency}
//                     {item.price} Qty : {item.quantity}
//                   </p>
//                   <p className="mb-1">
//                     {new Date(order.createdAt).toDateString()}
//                   </p>

//                   <div>
//                     {ratings.find(
//                       (rating) =>
//                         order.id === rating.orderId &&
//                         item.product.id === rating.productId,
//                     ) ? (
//                       <Rating
//                         value={
//                           ratings.find(
//                             (rating) =>
//                               order.id === rating.orderId &&
//                               item.product.id === rating.productId,
//                           ).rating
//                         }
//                       />
//                     ) : (
//                       <button
//                         onClick={() =>
//                           setRatingModal({
//                             orderId: order.id,
//                             productId: item.product.id,
//                           })
//                         }
//                         className={`text-green-500 hover:bg-green-50 transition ${
//                           order.status !== "DELIVERED" && "hidden"
//                         }`}
//                       >
//                         Rate Product
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {ratingModal && (
//               <RatingModal
//                 ratingModal={ratingModal}
//                 setRatingModal={setRatingModal}
//               />
//             )}
//           </div>
//         </td>

//         <td className="text-center max-md:hidden">
//           {currency}
//           {order.total}
//         </td>

//         <td className="text-left max-md:hidden">
//           <p>
//             {order.address.name}, {order.address.street},
//           </p>
//           <p>
//             {order.address.city}, {order.address.state}, {order.address.zip},{" "}
//             {order.address.country},
//           </p>
//           <p>{order.address.phone}</p>
//         </td>

//         <td className="text-left space-y-2 text-sm max-md:hidden">
//           <div
//             className={`flex items-center justify-center gap-1 rounded-full p-1 ${
//               order.status === "confirmed"
//                 ? "text-yellow-500 bg-yellow-100"
//                 : order.status === "delivered"
//                   ? "text-green-500 bg-green-100"
//                   : "text-slate-500 bg-slate-100"
//             }`}
//           >
//             <DotIcon size={10} className="scale-250" />
//             {order.status.split("_").join(" ").toLowerCase()}
//           </div>
//         </td>

//         <td className="text-center">
//           {/* ✅ One single button for all products */}
//           {order.status !== "DELIVERED" && (
//             <a
//               href={whatsappUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-green-500 text-white px-5 py-1 rounded-md hidden sm:flex hover:bg-green-600 transition"
//             >
//               Confirm Order with Seller
//             </a>
//           )}
//         </td>
//       </tr>

//       {/* Mobile View */}
//       <tr className="md:hidden flex flex-row">
//         <td colSpan={5}>
//           <p>
//             {order.address.name}, {order.address.street}
//           </p>
//           <p>
//             {order.address.city}, {order.address.state}, {order.address.zip},{" "}
//             {order.address.country}
//           </p>
//           <p>{order.address.phone}</p>
//           <br />
//           <div className="flex items-center mb-5">
//             <span className=" px-6 py-1.5 rounded bg-green-100 text-green-700">
//               {order.status.replace(/_/g, " ").toLowerCase()}
//             </span>
//           </div>

//           {order.status !== "DELIVERED" && (
//             <a
//               href={whatsappUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-green-500 text-white px-5 py-1 rounded-md hover:bg-green-600 transition"
//             >
//               Confirm Order with Seller
//             </a>
//           )}
//         </td>
//       </tr>

//       <tr>
//         <td colSpan={4}>
//           <div className="border-b border-slate-300 w-6/7 mx-auto" />
//         </td>
//       </tr>
//     </>
//   );
// };

// export default OrderItem;

"use client";
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";

const OrderItem = ({ order }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";
  const [ratingModal, setRatingModal] = useState(null);
  const { ratings } = useSelector((state) => state.rating);

  const sellerPhone = "+2347084775311";

  const productList = order.orderItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name}\n   - Quantity: ${item.quantity}\n   - Price: ${currency}${item.price} each`,
    )
    .join("\n");

  const totalAmount = `${currency}${order.total}`;

  const message = `Hello! I'm interested in purchasing the following items from your store:\n\n${productList}\n\nTotal Amount: ${totalAmount}\n\nDelivery Address:\n${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}\n\nPlease let me know how I can proceed with the payment.`;

  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <tr className="text-sm">
        {/* Product */}
        <td className="text-left py-5">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="border border-white/10 bg-white/3 rounded-xl p-1.5 flex-shrink-0">
                  <Image
                    className="h-14 w-auto object-contain rounded-lg"
                    src={item.product.images[0]}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col justify-center gap-0.5">
                  <p className="font-medium text-white/60 text-sm">
                    {item.product.name}
                  </p>
                  <p className="text-white/30 text-xs">
                    {currency}
                    {item.price} · Qty: {item.quantity}
                  </p>
                  <p className="text-white/20 text-xs">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                  <div className="mt-1">
                    {ratings.find(
                      (rating) =>
                        order.id === rating.orderId &&
                        item.product.id === rating.productId,
                    ) ? (
                      <Rating
                        value={
                          ratings.find(
                            (rating) =>
                              order.id === rating.orderId &&
                              item.product.id === rating.productId,
                          ).rating
                        }
                      />
                    ) : (
                      <button
                        onClick={() =>
                          setRatingModal({
                            orderId: order.id,
                            productId: item.product.id,
                          })
                        }
                        className={`text-[#c97b63] text-xs hover:underline underline-offset-4 transition ${
                          order.status !== "DELIVERED" && "hidden"
                        }`}
                      >
                        Rate Product →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {ratingModal && (
              <RatingModal
                ratingModal={ratingModal}
                setRatingModal={setRatingModal}
              />
            )}
          </div>
        </td>

        {/* Total */}
        <td className="text-center max-md:hidden text-white/60 font-medium">
          {currency}
          {order.total}
        </td>

        {/* Address */}
        <td className="text-left max-md:hidden">
          <p className="text-white/40 text-xs leading-relaxed">
            {order.address.name}, {order.address.street},
          </p>
          <p className="text-white/40 text-xs leading-relaxed">
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country}
          </p>
          <p className="text-white/30 text-xs mt-0.5">{order.address.phone}</p>
        </td>

        {/* Status */}
        <td
          className="text-left max-md:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border ${
              order.status === "DELIVERED"
                ? "bg-[#c97b63]/10 border-[#c97b63]/30 text-[#c97b63]"
                : order.status === "SHIPPED"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : order.status === "PROCESSING"
                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                    : "bg-white/5 border-white/10 text-white/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {order.status.split("_").join(" ").toLowerCase()}
          </div>
        </td>

        {/* Contact seller */}
        <td className="text-center">
          {order.status !== "DELIVERED" && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#c97b63] hover:bg-[#b56d55] text-white text-xs px-4 py-2 rounded-full transition-all duration-200 active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Confirm Order
            </a>
          )}
        </td>
      </tr>

      {/* Mobile view */}
      <tr className="md:hidden">
        <td colSpan={5} className="pb-4">
          <p className="text-white/35 text-xs leading-relaxed">
            {order.address.name}, {order.address.street}
          </p>
          <p className="text-white/35 text-xs leading-relaxed">
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country}
          </p>
          <p className="text-white/25 text-xs mt-0.5">{order.address.phone}</p>

          <div className="flex items-center gap-3 mt-4">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border ${
                order.status === "DELIVERED"
                  ? "bg-[#c97b63]/10 border-[#c97b63]/30 text-[#c97b63]"
                  : order.status === "SHIPPED"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : order.status === "PROCESSING"
                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                      : "bg-white/5 border-white/10 text-white/30"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {order.status.replace(/_/g, " ").toLowerCase()}
            </div>

            {order.status !== "DELIVERED" && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#c97b63] hover:bg-[#b56d55] text-white text-xs px-4 py-1.5 rounded-full transition-all"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Confirm Order
              </a>
            )}
          </div>
        </td>
      </tr>

      {/* Divider */}
      <tr>
        <td colSpan={5}>
          <div className="border-b border-white/8 w-full" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
