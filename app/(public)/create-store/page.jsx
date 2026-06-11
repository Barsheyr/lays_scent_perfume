"use client";
import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateStore() {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    image: "",
  });

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const fetchSellerStatus = async () => {
    const token = await getToken();
    try {
      const { data } = await axios.get("/api/store/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (["approved", "rejected", "pending"].includes(data.status)) {
        setStatus(data.status);
        setAlreadySubmitted(true);
        switch (data.status) {
          case "approved":
            setMessage(
              "Your store has been approved, you can now add products to your store from dashboard"
            );
            setTimeout(() => router.push("/store"), 5000);
            break;
          case "rejected":
            setMessage(
              "Your store request has been rejected, contact admin for more details"
            );
            break;
          case "pending":
            setMessage(
              "Your store request is pending, please wait for admin to approve your store"
            );
            break;
          default:
            break;
        }
      } else {
        setAlreadySubmitted(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast("Please login to continue");
    }
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", storeInfo.name);
      formData.append("description", storeInfo.description);
      formData.append("username", storeInfo.username);
      formData.append("email", storeInfo.email);
      formData.append("contact", storeInfo.contact);
      formData.append("address", storeInfo.address);
      formData.append("image", storeInfo.image);

      const { data } = await axios.post("/api/store/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      await fetchSellerStatus();
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerStatus();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] bg-[#0e0a0b] flex items-center justify-center mx-6">
        <div className="text-center">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-3">
            Authentication required
          </p>
          <h1 className="text-2xl sm:text-4xl font-serif italic text-white/30">
            Please login to continue
          </h1>
        </div>
      </div>
    );
  }

  return !loading ? (
    <>
      {!alreadySubmitted ? (
        <div className="mx-6 min-h-[70vh] my-16 bg-[#0e0a0b]">
          <form
            onSubmit={(e) =>
              toast.promise(onSubmitHandler(e), {
                loading: "Submitting data...",
              })
            }
            className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-white/50"
          >
            {/* Title */}
            <div className="mb-6">
              <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-2">
                Become a seller
              </p>
              <h1 className="text-3xl font-medium text-white">
                Add Your{" "}
                <span className="text-[#c97b63] italic font-serif">Store</span>
              </h1>
              <p className="max-w-lg text-white/35 text-sm mt-2 leading-relaxed">
                To become a seller on Lays Scent, submit your store details for
                review. Your store will be activated after admin verification.
              </p>
            </div>

            {/* Logo upload */}
            <label className="mt-6 cursor-pointer group">
              <p className="text-xs tracking-wide text-white/40 mb-2">
                Store Logo
              </p>
              <div className="border border-white/10 hover:border-[#c97b63]/40 rounded-xl p-3 transition-all duration-200 bg-white/3">
                <Image
                  src={
                    storeInfo.image
                      ? URL.createObjectURL(storeInfo.image)
                      : assets.upload_area
                  }
                  className="rounded-lg h-16 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                  alt=""
                  width={150}
                  height={100}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, image: e.target.files[0] })
                }
                hidden
              />
            </label>

            {/* Fields */}
            {[
              {
                label: "Username",
                name: "username",
                type: "text",
                placeholder: "Enter your store username",
              },
              {
                label: "Name",
                name: "name",
                type: "text",
                placeholder: "Enter your store name",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Enter your store email",
              },
              {
                label: "Contact Number",
                name: "contact",
                type: "text",
                placeholder: "Enter your store contact number",
              },
            ].map((field) => (
              <div key={field.name} className="w-full max-w-lg">
                <p className="text-xs tracking-wide text-white/40 mb-1.5">
                  {field.label}
                </p>
                <input
                  name={field.name}
                  onChange={onChangeHandler}
                  value={storeInfo[field.name]}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 w-full p-2.5 rounded-xl text-sm transition-colors"
                />
              </div>
            ))}

            <div className="w-full max-w-lg">
              <p className="text-xs tracking-wide text-white/40 mb-1.5">
                Description
              </p>
              <textarea
                name="description"
                onChange={onChangeHandler}
                value={storeInfo.description}
                rows={5}
                placeholder="Enter your store description"
                className="bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 w-full p-2.5 rounded-xl text-sm transition-colors resize-none"
              />
            </div>

            <div className="w-full max-w-lg">
              <p className="text-xs tracking-wide text-white/40 mb-1.5">
                Address
              </p>
              <textarea
                name="address"
                onChange={onChangeHandler}
                value={storeInfo.address}
                rows={5}
                placeholder="Enter your store address"
                className="bg-white/4 border border-white/10 focus:border-[#c97b63]/50 outline-none text-white/70 placeholder-white/20 w-full p-2.5 rounded-xl text-sm transition-colors resize-none"
              />
            </div>

            <button className="bg-[#c97b63] hover:bg-[#b56d55] text-white px-12 py-2.5 rounded-full mt-8 mb-40 active:scale-95 transition-all text-sm">
              Submit Application
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-[80vh] bg-[#0e0a0b] flex flex-col items-center justify-center text-center px-6">
          <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-4">
            {status === "approved"
              ? "Congratulations"
              : status === "rejected"
              ? "Application rejected"
              : "Under review"}
          </p>
          <p className="sm:text-2xl lg:text-3xl font-serif italic text-white/40 max-w-2xl">
            {message}
          </p>
          {status === "approved" && (
            <p className="mt-5 text-white/25 text-sm">
              Redirecting to dashboard in{" "}
              <span className="text-[#c97b63]">5 seconds</span>
            </p>
          )}
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
}
