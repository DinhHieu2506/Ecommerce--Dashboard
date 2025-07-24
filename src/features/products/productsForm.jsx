import React, { useState, useEffect } from "react";
import { Modal, Input, Select, InputNumber, Button, notification } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function ProductForm({ visible, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    stock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        description: "",
        stock: 0,
      });
    }
  }, [initialData, visible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
    };

    if (!trimmedData.name) {
      notification.error({ message: "Name is required" });
      return;
    }
    if (formData.price <= 0) {
      notification.error({ message: "Price must be greater than 0" });
      return;
    }

    if (formData.stock <= 0) {
      notification.error({ message: "Stock cannot be negative" });
      return;
    }
    onSave && onSave(trimmedData);
    notification.success({
      message: initialData ? "Product updated" : "Product added",
    });
    onClose();
  };

  return (
    <Modal
      title={initialData ? "Edit Product" : "Add Product"}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <Select
            value={formData.category}
            onChange={(value) => handleChange("category", value)}
            className="w-full"
            placeholder="Select category"
          >
            <Option value="">Select category</Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Clothing">Clothing</Option>
            <Option value="Books">Books</Option>
            <Option value="Home">Home & Garden</Option>
            <Option value="Sports">Sports & Outdoors</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Price
          </label>
          <InputNumber
            min={0}
            step={0.5}
            value={formData.price}
            onChange={(value) => handleChange("price", value)}
            className="w-full"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <TextArea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Stock
          </label>
          <InputNumber
            min={0}
            value={formData.stock}
            onChange={(value) => handleChange("stock", value)}
            className="w-full"
            placeholder="Enter stock quantity"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          {initialData ? "Update" : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
