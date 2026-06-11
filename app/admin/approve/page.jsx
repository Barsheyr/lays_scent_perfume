"use client";
import { storesDummyData } from "@/assets/assets";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminApprove() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/approve-store", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(data.stores);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const handleApprove = async ({ storeId, status }) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/approve-store",
        { storeId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      await fetchStores();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStores();
    }
  }, [user]);

  return !loading ? (
    <div className="text-white/50 mb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Management
        </p>
        <h1 className="text-2xl font-medium text-white">
          Approve{" "}
          <span className="text-[#c97b63] italic font-serif">Stores</span>
        </h1>
      </div>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="border border-white/8 bg-white/3 hover:border-[#c97b63]/20 transition-all duration-300 rounded-2xl p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              {/* Store Info */}
              <StoreInfo store={store} />

              {/* Actions */}
              <div className="flex gap-3 pt-2 flex-wrap">
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "approved" }),
                      { loading: "Approving..." }
                    )
                  }
                  className="px-5 py-2 bg-[#c97b63] hover:bg-[#b56d55] text-white rounded-full text-sm transition-colors duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    toast.promise(
                      handleApprove({ storeId: store.id, status: "rejected" }),
                      { loading: "Rejecting..." }
                    )
                  }
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 rounded-full text-sm transition-all duration-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
            All clear
          </p>
          <h1 className="text-3xl font-serif italic text-white/20">
            No Applications Pending
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}
