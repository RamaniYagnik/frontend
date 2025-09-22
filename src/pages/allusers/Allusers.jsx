import React, { useEffect, useState } from "react";
import api from "../../api/Api";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      console.log("API Response:", res.data);
      setUsers(res.data.message || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      });
      toast.success("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users Management</h1>

      {/* ✅ Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Email</th>
              <th className="px-4 py-2 border text-left">Role</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.role}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <button
                      onClick={() => setEditUser(u)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={4}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>

            <label className="block mb-2">
              Name
              <input
                type="text"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>

            <label className="block mb-2">
              Email
              <input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>

            <label className="block mb-4">
              Role
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="user">User</option>
                <option value="sub-admin">Sub-Admin</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
