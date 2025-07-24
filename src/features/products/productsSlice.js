import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCTS_URL = `${BASE_URL}/products`;
const ORDERS_URL = `${BASE_URL}/orders`;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get(PRODUCTS_URL);
    return res.data;
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.post(PRODUCTS_URL, product);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Add failed"
      );
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${PRODUCTS_URL}/${product.id}`, product);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue("Product not found");
      }
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${PRODUCTS_URL}/${id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue("Product not found");
      }
      return rejectWithValue(error.message || "Delete failed");
    }

    const ordersRes = await axios.get(ORDERS_URL);
    const orders = ordersRes.data;
    const ordersToUpdateOrDelete = orders.filter((order) =>
      order.productIds.includes(id)
    );

    for (const order of ordersToUpdateOrDelete) {
      const updatedProductIds = order.productIds.filter((pid) => pid !== id);
      if (updatedProductIds.length === 0) {
        await axios.delete(`${ORDERS_URL}/${order.id}`);
      } else {
        await axios.put(`${ORDERS_URL}/${order.id}`, {
          ...order,
          productIds: updatedProductIds,
        });
      }
    }

    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
