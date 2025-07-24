import { useState } from "react";
import { Popover } from "antd";
import {
  ClockCircleOutlined,
  LoadingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "./ordersSlice";

const statusOptions = {
  pending: {
    label: "Pending",
    icon: <ClockCircleOutlined className="text-yellow-600" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    label: "Processing",
    icon: <LoadingOutlined className="text-blue-600" />,
    color: "bg-blue-100 text-blue-800",
  },
  shipped: {
    label: "Shipped",
    icon: <CarOutlined className="text-purple-600" />,
    color: "bg-purple-100 text-purple-800",
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircleOutlined className="text-green-600" />,
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: <StopOutlined className="text-red-600" />,
    color: "bg-red-100 text-red-800",
  },
};

export default function OrderStatusPopover({ order }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (status) => {
    if (status !== order.status) {
      dispatch(updateOrderStatus({ id: order.id, status }));
    }
    setOpen(false);
  };

  const content = (
    <div className="w-48">
      {Object.entries(statusOptions).map(([key, { label, icon }]) => (
        <div
          key={key}
          onClick={() => handleChange(key)}
          className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded ${
            key === order.status ? "bg-gray-100" : ""
          }`}
        >
          {icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );

  const current = statusOptions[order.status];

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
    >
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border cursor-pointer ${current.color}`}
      >
        {current.icon}
        {current.label}
      </div>
    </Popover>
  );
}
