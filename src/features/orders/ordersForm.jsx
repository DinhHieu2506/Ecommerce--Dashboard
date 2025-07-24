import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "antd";

export default function OrderForm({ open, onClose }) {
  const order = useSelector((state) => state.orders.selectedOrder);
  const products = useSelector((state) => state.products.products);

  return (
    <Modal
      open={open}
      title={order ? `Order Details - #${order.id}` : "Order Details"}
      onCancel={onClose}
      footer={null}
      centered
    >
      {order ? (
        <div className="space-y-4">
          <p>
            <strong>User ID:</strong> {order.userId}
          </p>

          <p>
            <strong>Product IDs:</strong> {order.productIds.join(", ")}
          </p>

          <div>
            <strong>Product Names:</strong>
            <ul className="list-disc pl-5">
              {products?.length ? (
                order.productIds.map((id) => {
                  const product = products.find(
                    (p) => String(p.id) === String(id)
                  );
                  return (
                    <li key={id}>
                      {product ? product.name : `Unknown product (ID: ${id})`}
                    </li>
                  );
                })
              ) : (
                <li>Loading product names...</li>
              )}
            </ul>
          </div>

          <p>
            <strong>Total Price:</strong> ${order.totalPrice}
          </p>

          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <div>
            <strong>Status:</strong>{" "}
            <span className="capitalize inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
              {order.status}
            </span>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      ) : (
        <p>No order selected.</p>
      )}
    </Modal>
  );
}
