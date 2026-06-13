import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchUsers,
  updateUserRole,
} from "../store/slices/authSlice";
import type { Role } from "../store/slices/authSlice";

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const changeRole = async (userId: string, role: Role) => {
    await dispatch(updateUserRole({ userId, role }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">User Management</h1>
        <p className="mt-2 text-gray-400">
          Review accounts and manage platform permissions.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[var(--bg2)] p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-gray-400">
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5">
                <td className="py-4 font-medium text-white">{user.name}</td>
                <td className="py-4 text-sm text-gray-300">{user.email}</td>
                <td className="py-4">
                  <select
                    value={user.role}
                    disabled={user.role === "Admin"}
                    onChange={(event) =>
                      changeRole(user._id || "", event.target.value as Role)
                    }
                    className="rounded-xl border border-white/10 bg-[var(--bg3)] px-3 py-2 text-sm text-white outline-none disabled:opacity-60"
                  >
                    <option value="User">User</option>
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && users.length === 0 && (
          <p className="py-12 text-center text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
}
