import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action creator untuk menambahkan produk ke keranjang
export const addToCart = createAsyncThunk(
  "counter/addToCart",
  async (product, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/cart",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw Error("Error adding product to cart: " + error.message);
    }
  }
);

// Action creator untuk mengambil data keranjang
export const fetchCartData = createAsyncThunk(
  "counter/fetchCartData",
  async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Action creator untuk memperbarui qty produk di keranjang menggunakan PUT
export const updateCartQty = createAsyncThunk(
  "counter/updateCartQty",
  async (product, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/cart",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw Error("Error updating product qty: " + error.message);
    }
  }
);

const initialState = {
  value: 0, // Nilai awal sementara
  cart: [],
  status: "idle",
  error: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    updateCartLocally: (state, action) => {
      const updatedProduct = action.payload.items[0];
      const existingItem = state.cart.find(
        (item) => item._id === updatedProduct._id
      );
      if (existingItem) {
        existingItem.qty = updatedProduct.qty;
        state.value = state.cart.reduce((total, item) => total + item.qty, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart.push(action.payload);
        state.value += 1;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCartData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.value = action.payload.reduce(
          (total, item) => total + item.qty,
          0
        ); // Menghitung jumlah total qty dari keranjang
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartQty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload;
        const existingItem = state.cart.find(
          (item) => item._id === updatedProduct._id
        );
        if (existingItem) {
          existingItem.qty = updatedProduct.qty;
          state.value = state.cart.reduce((total, item) => total + item.qty, 0);
        }
      })
      .addCase(updateCartQty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { increment, decrement, incrementByAmount, updateCartLocally } =
  counterSlice.actions;

// Mengekspor reducer
export default counterSlice.reducer;

// Fungsi untuk mengambil initial state dari local storage
export const getInitialState = () => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    // Jika token tersedia, ambil data keranjang dari API
    return async (dispatch) => {
      try {
        await dispatch(fetchCartData());
      } catch (error) {
        console.error("Error fetching initial cart data:", error);
      }
    };
  } else {
    // Jika tidak ada token, kembalikan fungsi kosong
    return () => {};
  }
};
