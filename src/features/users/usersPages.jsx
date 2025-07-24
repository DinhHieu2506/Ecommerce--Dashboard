import React, { useEffect, useState } from "react";
import { SquarePen, Trash, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  setSearchTerm,
  setRoleFilter,
} from "./usersSlice";
import { Input, Select, Modal, notification } from "antd";
import UserForm from "./usersForm";

const { Option } = Select;

export default function UsersPage() {
  const dispatch = useDispatch();
  const { list, searchTerm, roleFilter } = useSelector((state) => state.users);
  const [editingUser, setEditingUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Confirm delete",
      content: "Are you sure you want to delete this user?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(deleteUser(id)).unwrap();
          notification.success({
            message: "Deleted",
            description: "User deleted successfully.",
            duration: 10,
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

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
            Admin
          </span>
        );
      case "customer":
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            Customer
          </span>
        );
    }
  };

  const filteredUsers = list.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter ? user.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          placeholder="Search by name or email..."
          prefix={<Search size={18} className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="w-full md:w-1/2"
        />

        <Select
          value={roleFilter}
          onChange={(value) => dispatch(setRoleFilter(value))}
          placeholder="All Roles"
          className="w-full md:w-auto"
          style={{ minWidth: 160 }}
          allowClear
        >
          <Option value="">All Roles</Option>
          <Option value="admin">Admin</Option>
          <Option value="customer">Customer</Option>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  NAME
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  EMAIL
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  ROLE
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  CREATED
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                        onClick={() => {
                          setEditingUser(user);
                          setFormOpen(true);
                        }}
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserForm
        visible={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
      />
    </div>
  );
}
