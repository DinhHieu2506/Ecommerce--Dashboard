import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ORDERS_URL = `${API_BASE_URL}/orders`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;

const calculateTotalPrice = async (productIds) => {
  const res = await axios.get(PRODUCTS_URL);
  const allProducts = res.data;
  return productIds.reduce((total, id) => {
    const product = allProducts.find((p) => p.id === id);
    return product ? total + product.price : total;
  }, 0);
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const [ordersRes, productsRes] = await Promise.all([
    axios.get(ORDERS_URL),
    axios.get(PRODUCTS_URL),
  ]);

  const orders = ordersRes.data;
  const products = productsRes.data;

  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      // Lọc những productId còn tồn tại
      const validProductIds = order.productIds.filter((id) =>
        products.some((p) => p.id === id)
      );

      // Tính lại tổng giá đơn hàng
      const totalPrice = validProductIds.reduce((sum, id) => {
        const product = products.find((p) => p.id === id);
        return product ? sum + product.price : sum;
      }, 0);

      // Nếu có thay đổi productIds -> cập nhật lại order trên server
      if (validProductIds.length !== order.productIds.length) {
        await axios.patch(`${ORDERS_URL}/${order.id}`, {
          productIds: validProductIds,
        });
      }

      return {
        ...order,
        productIds: validProductIds,
        totalPrice,
      };
    })
  );

  return enrichedOrders;
});

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }) => {
    const res = await axios.patch(`${ORDERS_URL}/${id}`, { status });
    return res.data;
  }
);

export const addOrder = createAsyncThunk("orders/addOrder", async (order) => {
  const totalPrice = await calculateTotalPrice(order.productIds);
  const fullOrder = {
    ...order,
    totalPrice,
    createdAt: new Date().toISOString(),
  };
  const res = await axios.post(ORDERS_URL, fullOrder);
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
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
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
        const index = state.list.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          if (state.selectedOrder?.id === action.payload.id) {
            state.selectedOrder = action.payload;
          }
        }
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { selectOrder, clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
