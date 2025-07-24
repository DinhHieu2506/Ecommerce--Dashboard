import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye } from "lucide-react";
import { fetchOrders, selectOrder } from "./ordersSlice";
import OrderForm from "./ordersForm";
import { fetchUsers } from "../users/usersSlice";
import OrderStatusPopover from "./ordersStatus"; 

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const users = useSelector((state) => state.users.list);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleView = (order) => {
    dispatch(selectOrder(order));
    setVisible(true);
  };

  const getUserNameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Unknown";
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
                  <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm">
                    <OrderStatusPopover order={order} />{" "}
                    {/* 👈 Thay thế badge bằng popover */}
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