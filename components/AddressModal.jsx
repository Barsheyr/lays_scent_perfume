// "use client";
// import { addAddress } from "@/lib/features/address/addressSlice";
// import { useAuth } from "@clerk/clerk-react";
// import { XIcon } from "lucide-react";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import axios from "axios";

// const AddressModal = ({ setShowAddressModal }) => {
//   const { getToken } = useAuth();

//   const dispatch = useDispatch();

//   const [address, setAddress] = useState({
//     name: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zip: "",
//     country: "",
//     phone: "",
//   });

//   const handleAddressChange = (e) => {
//     setAddress({
//       ...address,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         "/api/address",
//         { address },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       dispatch(addAddress(data.newAddress));
//       toast.success(data.message);
//       setShowAddressModal(false);
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={(e) =>
//         toast.promise(handleSubmit(e), { loading: "Adding Address..." })
//       }
//       className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center"
//     >
//       <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6">
//         <h2 className="text-3xl ">
//           Add New <span className="font-semibold">Address</span>
//         </h2>
//         <input
//           name="name"
//           onChange={handleAddressChange}
//           value={address.name}
//           className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//           type="text"
//           placeholder="Enter your name"
//           required
//         />
//         <input
//           name="email"
//           onChange={handleAddressChange}
//           value={address.email}
//           className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//           type="email"
//           placeholder="Email address"
//           required
//         />
//         <input
//           name="street"
//           onChange={handleAddressChange}
//           value={address.street}
//           className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//           type="text"
//           placeholder="Street"
//           required
//         />
//         <div className="flex gap-4">
//           <input
//             name="city"
//             onChange={handleAddressChange}
//             value={address.city}
//             className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//             type="text"
//             placeholder="City"
//             required
//           />
//           <input
//             name="state"
//             onChange={handleAddressChange}
//             value={address.state}
//             className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//             type="text"
//             placeholder="State"
//             required
//           />
//         </div>
//         <div className="flex gap-4">
//           <input
//             name="zip"
//             onChange={handleAddressChange}
//             value={address.zip}
//             className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//             type="number"
//             placeholder="Zip code"
//             required
//           />
//           <input
//             name="country"
//             onChange={handleAddressChange}
//             value={address.country}
//             className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//             type="text"
//             placeholder="Country"
//             required
//           />
//         </div>
//         <input
//           name="phone"
//           onChange={handleAddressChange}
//           value={address.phone}
//           className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
//           type="text"
//           placeholder="Phone"
//           required
//         />
//         <button className="bg-slate-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-900 active:scale-95 transition-all">
//           SAVE ADDRESS
//         </button>
//       </div>
//       <XIcon
//         size={30}
//         className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer"
//         onClick={() => setShowAddressModal(false)}
//       />
//     </form>
//   );
// };

// export default AddressModal;

"use client";
import { addAddress } from "@/lib/features/address/addressSlice";
import { useAuth } from "@clerk/nextjs";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";

const AddressModal = ({ setShowAddressModal }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/address",
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addAddress(data.newAddress));
      toast.success(data.message);
      setShowAddressModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const inputClass =
    "p-2.5 px-4 outline-none bg-white/4 border border-white/10 focus:border-[#c97b63]/50 text-white/70 placeholder-white/25 rounded-xl w-full text-sm transition-colors";

  return (
    <form
      onSubmit={(e) =>
        toast.promise(handleSubmit(e), { loading: "Adding Address..." })
      }
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm h-screen flex items-center justify-center px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-4 w-full max-w-sm border border-white/8 bg-[#0e0a0b] rounded-2xl p-8"
      >
        <XIcon
          size={20}
          className="absolute top-6 right-6 text-white/30 hover:text-white cursor-pointer transition-colors"
          onClick={() => setShowAddressModal(false)}
        />

        <p className="text-[11px] tracking-[3px] uppercase text-[#c97b63] mb-1">
          Delivery
        </p>
        <h2 className="text-xl font-serif italic text-white mb-2">
          Add New Address
        </h2>

        <input
          name="name"
          onChange={handleAddressChange}
          value={address.name}
          className={inputClass}
          type="text"
          placeholder="Full name"
          required
        />
        <input
          name="email"
          onChange={handleAddressChange}
          value={address.email}
          className={inputClass}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={handleAddressChange}
          value={address.street}
          className={inputClass}
          type="text"
          placeholder="Street"
          required
        />
        <div className="flex gap-3">
          <input
            name="city"
            onChange={handleAddressChange}
            value={address.city}
            className={inputClass}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={handleAddressChange}
            value={address.state}
            className={inputClass}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            name="zip"
            onChange={handleAddressChange}
            value={address.zip}
            className={inputClass}
            type="number"
            placeholder="Zip code"
            required
          />
          <input
            name="country"
            onChange={handleAddressChange}
            value={address.country}
            className={inputClass}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={handleAddressChange}
          value={address.phone}
          className={inputClass}
          type="text"
          placeholder="Phone"
          required
        />

        <button className="bg-[#c97b63] hover:bg-[#b56d55] text-white text-sm font-medium py-3 rounded-full active:scale-95 transition-all mt-1">
          Save Address
        </button>
      </div>
    </form>
  );
};

export default AddressModal;
