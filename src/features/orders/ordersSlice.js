import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Sử dụng biến môi trường
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const ordersUrl = `${baseApiUrl}/orders`;
const productsUrl = `${baseApiUrl}/products`;

const calculateTotalPrice = async (productIds) => {
  const res = await axios.get(productsUrl);
  const allProducts = res.data;
  return productIds.reduce((total, id) => {
    const product = allProducts.find(p => p.id === id);
    return product ? total + product.price : total;
  }, 0);
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const [ordersRes, productsRes] = await Promise.all([
    axios.get(ordersUrl),
    axios.get(productsUrl),
  ]);

  const orders = ordersRes.data;
  const products = productsRes.data;

  const enrichedOrders = orders.map(order => {
    const totalPrice = order.productIds.reduce((sum, id) => {
      const product = products.find(p => p.id === id);
      return product ? sum + product.price : sum;
    }, 0);
    return { ...order, totalPrice };
  });

  return enrichedOrders;
});

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }) => {
    const res = await axios.patch(`${ordersUrl}/${id}`, { status });
    return res.data;
  }
);

export const addOrder = createAsyncThunk("orders/addOrder", async (order) => {
  const totalPrice = await calculateTotalPrice(order.productIds);
  const fullOrder = { ...order, totalPrice, createdAt: new Date().toISOString() };
  const res = await axios.post(ordersUrl, fullOrder);
  return res.data;
});

export const updateOrder = createAsyncThunk("orders/updateOrder", async (order) => {
  const totalPrice = await calculateTotalPrice(order.productIds);
  const fullOrder = { ...order, totalPrice };
  const res = await axios.put(`${ordersUrl}/${order.id}`, fullOrder);
  return res.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false,
    selectedOrder: null,
  },
  reducers: {
    selectOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          if (state.selectedOrder?.id === action.payload.id) {
            state.selectedOrder = action.payload;
          }
        }
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          if (state.selectedOrder?.id === action.payload.id) {
            state.selectedOrder = action.payload;
          }
        }
      });
  },
});

export const { selectOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
