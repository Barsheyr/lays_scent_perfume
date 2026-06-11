"use client";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

const AdminLayout = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
    }
  }, [user]);

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="flex flex-col h-screen bg-[#0e0a0b]">
      <AdminNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <AdminSidebar />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-[#0e0a0b] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
        Access Denied
      </p>
      <h1 className="text-2xl sm:text-4xl font-serif italic text-white/40">
        You are not authorized to access this page
      </h1>
      <Link
        href="/"
        className="flex items-center gap-2 mt-8 px-6 py-2.5 bg-[#c97b63] hover:bg-[#b56d55] text-white text-sm rounded-full transition-colors"
      >
        Go to home <ArrowRightIcon size={16} />
      </Link>
    </div>
  );
};

export default AdminLayout;
