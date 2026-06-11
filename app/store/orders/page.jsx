"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/store/orders",
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-white/50 mb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Store
        </p>
        <h1 className="text-2xl font-medium text-white">
          Store <span className="text-[#c97b63] italic font-serif">Orders</span>
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
            All clear
          </p>
          <h2 className="text-3xl font-serif italic text-white/20">
            No orders found
          </h2>
        </div>
      ) : (
        <div className="overflow-x-auto max-w-4xl border border-white/8 rounded-2xl">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                {[
                  "Sr.",
                  "Customer",
                  "Total",
                  "Payment",
                  "Coupon",
                  "Status",
                  "Date",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-[10px] tracking-[2px] uppercase text-white/30 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-t border-white/5 hover:bg-white/3 transition-colors duration-150 cursor-pointer"
                  onClick={() => openModal(order)}
                >
                  <td className="pl-6 py-3 text-[#c97b63]">{index + 1}</td>
                  <td className="px-4 py-3 text-white/60">
                    {order.user?.name}
                  </td>
                  <td className="px-4 py-3 font-medium text-white/70">
                    ₦{order.total}
                  </td>
                  <td className="px-4 py-3 text-white/40">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    {order.isCouponUsed ? (
                      <span className="bg-[#c97b63]/10 border border-[#c97b63]/30 text-[#c97b63] text-xs px-2 py-1 rounded-full">
                        {order.coupon?.code}
                      </span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="bg-white/5 border border-white/10 text-white/50 rounded-lg text-xs px-2 py-1.5 outline-none focus:border-[#c97b63]/40 transition-colors"
                    >
                      <option value="ORDER_PLACED" className="bg-[#0e0a0b]">
                        ORDER_PLACED
                      </option>
                      <option value="PROCESSING" className="bg-[#0e0a0b]">
                        PROCESSING
                      </option>
                      <option value="SHIPPED" className="bg-[#0e0a0b]">
                        SHIPPED
                      </option>
                      <option value="DELIVERED" className="bg-[#0e0a0b]">
                        DELIVERED
                      </option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/25 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#130d0e] border border-white/10 rounded-2xl shadow-xl max-w-2xl w-full p-6 relative mx-4"
          >
            {/* Modal header */}
            <div className="mb-6 text-center">
              <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
                Details
              </p>
              <h2 className="text-xl font-serif italic text-white/70">
                Order Details
              </h2>
            </div>

            {/* Customer Details */}
            <div className="mb-5 border border-white/8 bg-white/3 rounded-xl p-4">
              <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-3">
                Customer
              </p>
              {[
                { label: "Name", val: selectedOrder.user?.name },
                { label: "Email", val: selectedOrder.user?.email },
                { label: "Phone", val: selectedOrder.address?.phone },
                {
                  label: "Address",
                  val: `${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`,
                },
              ].map((item) => (
                <p key={item.label} className="text-sm text-white/40 mb-1">
                  <span className="text-white/25 mr-2">{item.label}:</span>
                  {item.val}
                </p>
              ))}
            </div>

            {/* Products */}
            <div className="mb-5">
              <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-3">
                Products
              </p>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-white/8 bg-white/3 rounded-xl p-3"
                  >
                    <img
                      src={
                        item.product.images?.[0].src || item.product.images?.[0]
                      }
                      alt={item.product?.name}
                      className="w-14 h-14 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1">
                      <p className="text-white/60 font-medium">
                        {item.product?.name}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-[#c97b63] text-xs">₦{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status */}
            <div className="mb-5 border border-white/8 bg-white/3 rounded-xl p-4">
              <p className="text-[10px] tracking-[2px] uppercase text-[#c97b63] mb-3">
                Payment & Status
              </p>
              {[
                { label: "Payment Method", val: selectedOrder.paymentMethod },
                { label: "Paid", val: selectedOrder.isPaid ? "Yes" : "No" },
                { label: "Status", val: selectedOrder.status },
                {
                  label: "Order Date",
                  val: new Date(selectedOrder.createdAt).toLocaleString(),
                },
              ].map((item) => (
                <p key={item.label} className="text-sm text-white/40 mb-1">
                  <span className="text-white/25 mr-2">{item.label}:</span>
                  {item.val}
                </p>
              ))}
              {selectedOrder.isCouponUsed && (
                <p className="text-sm text-white/40">
                  <span className="text-white/25 mr-2">Coupon:</span>
                  {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}%
                  off)
                </p>
              )}
            </div>

            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 rounded-full text-sm transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
