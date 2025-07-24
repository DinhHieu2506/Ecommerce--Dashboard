import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Clock, Loader, Truck, CheckCircle, Ban } from "lucide-react";
import { fetchOrders, selectOrder, updateOrderStatus } from "./ordersSlice";
import OrderForm from "./ordersForm";
import { fetchUsers } from "../users/usersSlice";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleView = (order) => {
    dispatch(selectOrder(order));
    setVisible(true);
  };

  const users = useSelector((state) => state.users.list);

  const getUserNameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Unknown";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
            <Clock size={14} /> Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            <Loader size={14} className="animate-spin" /> Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
            <Truck size={14} /> Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
            <CheckCircle size={14} /> Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
            <Ban size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
            <Clock size={14} /> Unknown
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="min-w-[120px] text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                ORDER ID
              </th>
              <th className="min-w-[150px] text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                CUSTOMER
              </th>
              <th className="min-w-[130px] text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                STATUS
              </th>
              <th className="min-w-[120px] text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                TOTAL PRICE
              </th>
              <th className="min-w-[140px] text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                CREATED
              </th>
              <th className="min-w-[100px] text-center py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-900 break-words">
                    {order.id}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600 break-words">
                    {getUserNameById(order.userId)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-900 capitalize">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600">
                    ${order.totalPrice}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center justify-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                        onClick={() => handleView(order)}
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OrderForm open={visible} onClose={() => setVisible(false)} />
    </div>
  );
}
