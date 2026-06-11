"use client";
import { storesDummyData } from "@/assets/assets";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminStores() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(data.stores);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const toggleIsActive = async (storeId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/toggle-store",
        { storeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchStores();
      toast.success(data.message);
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
          Live <span className="text-[#c97b63] italic font-serif">Stores</span>
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

              {/* Toggle */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <p className="text-xs text-white/30 tracking-wide">Active</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleIsActive(store.id), {
                        loading: "Updating...",
                      })
                    }
                    checked={store.isActive}
                  />
                  <div className="w-9 h-5 bg-white/10 border border-white/10 rounded-full peer peer-checked:bg-[#c97b63] peer-checked:border-[#c97b63] transition-all duration-300"></div>
                  <span className="dot absolute left-1 top-1 w-3 h-3 bg-white/40 peer-checked:bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63]">
            Nothing here
          </p>
          <h1 className="text-3xl font-serif italic text-white/20">
            No Stores Available
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}
