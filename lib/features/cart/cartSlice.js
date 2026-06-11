// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// let debounceTimer = null;

// export const uploadCart = createAsyncThunk(
//   "cart/uploadCart",
//   async ({ getToken }, thunkAPI) => {
//     try {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(async () => {
//         const { cartItems } = thunkAPI.getState().cart;
//         const token = await getToken();
//         await axios.post(
//           "/api/cart",
//           { cart: cartItems },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }, 1000);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async ({ getToken }, thunkAPI) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/cart", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     total: 0,
//     cartItems: {},
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       const { productId } = action.payload;
//       if (state.cartItems[productId]) {
//         state.cartItems[productId]++;
//       } else {
//         state.cartItems[productId] = 1;
//       }
//       state.total += 1;
//     },
//     removeFromCart: (state, action) => {
//       const { productId } = action.payload;
//       if (state.cartItems[productId]) {
//         state.cartItems[productId]--;
//         if (state.cartItems[productId] === 0) {
//           delete state.cartItems[productId];
//         }
//       }
//       state.total -= 1;
//     },
//     deleteItemFromCart: (state, action) => {
//       const { productId } = action.payload;
//       state.total -= state.cartItems[productId]
//         ? state.cartItems[productId]
//         : 0;
//       delete state.cartItems[productId];
//     },
//     clearCart: (state) => {
//       state.cartItems = {};
//       state.total = 0;
//     },
//   },

//   extraReducers: (builder) => {
//     builder.addCase(fetchCart.fulfilled, (state, action) => {
//       state.cartItems = action.payload.cart;
//       state.total = Object.values(action.payload.cart).reduce(
//         (acc, item) => acc + item,
//         0
//       );
//     });
//   },
// });

// export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let debounceTimer = null;

// ==================== LOCALSTORAGE HELPERS ====================
const CART_STORAGE_KEY = "guestCart";

const loadCartFromStorage = () => {
  try {
    if (typeof window === "undefined") return { cartItems: {}, total: 0 };

    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedCart === null) {
      return { cartItems: {}, total: 0 };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return { cartItems: {}, total: 0 };
  }
};

const saveCartToStorage = (cartItems, total) => {
  try {
    if (typeof window === "undefined") return;

    const serializedCart = JSON.stringify({ cartItems, total });
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

const clearCartFromStorage = () => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing cart from localStorage:", err);
  }
};

// ==================== ASYNC THUNKS (FOR CLERK AUTH - KEEP FOR FUTURE) ====================
export const uploadCart = createAsyncThunk(
  "cart/uploadCart",
  async ({ getToken }, thunkAPI) => {
    try {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const { cartItems } = thunkAPI.getState().cart;
        const token = await getToken();
        await axios.post(
          "/api/cart",
          { cart: cartItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }, 1000);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ getToken }, thunkAPI) => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ==================== CART SLICE ====================
// Initialize cart from localStorage for guest users
const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]++;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;

      // Save to localStorage for guest users
      saveCartToStorage(state.cartItems, state.total);
    },

    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]--;
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId];
        }
        state.total -= 1;

        // Save to localStorage for guest users
        saveCartToStorage(state.cartItems, state.total);
      }
    },

    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId]
        ? state.cartItems[productId]
        : 0;
      delete state.cartItems[productId];

      // Save to localStorage for guest users
      saveCartToStorage(state.cartItems, state.total);
    },

    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;

      // Clear localStorage
      clearCartFromStorage();
    },

    // Optional: Load cart from localStorage manually
    loadCartFromLocalStorage: (state) => {
      const savedCart = loadCartFromStorage();
      state.cartItems = savedCart.cartItems;
      state.total = savedCart.total;
    },
  },

  extraReducers: (builder) => {
    // For authenticated users (KEEP FOR FUTURE)
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cart;
      state.total = Object.values(action.payload.cart).reduce(
        (acc, item) => acc + item,
        0
      );

      // Also save to localStorage as backup
      saveCartToStorage(state.cartItems, state.total);
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  deleteItemFromCart,
  loadCartFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
