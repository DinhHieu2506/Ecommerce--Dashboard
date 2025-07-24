import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "./ordersSlice";
import { Modal, Select } from "antd";

const statusOptions = ["pending", "processing", "shipped", "delivered"];

export default function OrderForm({ open, onClose }) {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.selectedOrder);

  const handleStatusChange = (value) => {
    dispatch(updateOrderStatus({ id: order.id, status: value }));
  };

  return (
    <Modal
      open={open}
      title={`Order Details - #${order?.id}`}
      onCancel={onClose}
      footer={null}
    >
      {order ? (
        <div className="space-y-4">
          <p>
            <strong>User ID:</strong> {order.userId}
          </p>
          <p>
            <strong>Product IDs:</strong> {order.productIds.join(", ")}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.totalPrice}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <div>
            <strong>Status:</strong>{" "}
            <Select
              value={order.status}
              onChange={handleStatusChange}
              style={{ width: 200 }}
            >
              {statusOptions.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
}
