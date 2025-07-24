// usersForm.js
import React, { useState, useEffect } from "react";
import { Modal, Input, Select, notification } from "antd";
import { useDispatch } from "react-redux";
import { updateUser } from "./usersSlice";

const { Option } = Select;

export default function UserForm({ visible, onClose, user }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      notification.error({ message: "Name is required" });
      return;
    }

    if (!formData.email.trim()) {
      notification.error({ message: "Email is required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      notification.error({ message: "Invalid email format" });
      return;
    }

    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    dispatch(updateUser(trimmedData));
    notification.success({ message: "User updated successfully" });
    onClose();
  };

  if (!formData) return null;

  return (
    <Modal
      title="Edit User"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      centered
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <Input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="example@domain.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <Select
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
            className="w-full"
            placeholder="Select Role"
          >
            <Option value="admin">Admin</Option>
            <Option value="customer">Customer</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
