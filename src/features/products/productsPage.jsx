import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SquarePen, Trash } from "lucide-react";
import { notification, Modal } from "antd";
import ProductForm from "./productsForm";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  clearError,
} from "./productsSlice";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      notification.error({ message: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSave = (data) => {
    if (editingProduct) {
      // ✅ Gộp id vào để gửi lên đúng format
      dispatch(updateProduct({ ...data, id: editingProduct.id }));
    } else {
      dispatch(addProduct(data));
    }
    setOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Confirm delete",
      content: "Are you sure you want to delete this user?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(deleteProduct(id)).unwrap();
          notification.success({
            message: "Deleted",
            description: "User deleted successfully.",
            duration: 2,
          });
        } catch (error) {
          notification.error({
            message: "Delete failed",
            description: "There was an error while deleting the user.",
          });
        }
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Products Management
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => {
            setEditingProduct(null);
            setOpen(true);
          }}
        >
          Add Product
        </button>
      </div>

      <ProductForm
        visible={open}
        onClose={() => {
          setOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  NAME
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  CATEGORY
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  PRICE
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  DESCRIPTION
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  STOCK
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {product.description}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                          onClick={() => {
                            setEditingProduct(product);
                            setOpen(true);
                          }}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
