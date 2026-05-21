import {
  useEffect,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  fetchCurrentUser,
  updateCurrentUser,
} from "../store/slices/authSlice";

export default function UserDetails() {
  const dispatch =
    useAppDispatch();

  const {
    user,
    loading,
    error,
  } = useAppSelector(
    (state) => state.auth
  );

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [
    success,
    setSuccess,
  ] = useState("");

  useEffect(() => {

    dispatch(fetchCurrentUser());

  }, [dispatch]);

  useEffect(() => {

    if (!user) {

      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));

  }, [user]);

  const handleChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {

      event.preventDefault();
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ...(formData.password
          ? {
              password:
                formData.password,
            }
          : {}),
      };

      const result =
        await dispatch(
          updateCurrentUser(
            payload
          )
        );

      if (
        updateCurrentUser.fulfilled.match(
          result
        )
      ) {

        setFormData((prev) => ({
          ...prev,
          password: "",
        }));

        setSuccess(
          "User details updated successfully."
        );
      }
    };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          User Details
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your profile and account information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">
            Profile Information
          </h2>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full rounded-xl border border-white/10 bg-[var(--bg3)] px-4 py-3 text-white outline-none transition-all focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 rounded-xl px-5 py-3 font-semibold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-600"
                : "bg-[var(--accent)] hover:opacity-90"
            }`}
          >
            {loading
              ? "Saving..."
              : "Update Details"}
          </button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-6">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--accent)] text-3xl font-bold text-white">
            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <h2 className="text-2xl font-bold text-white">
            {user?.name || "User"}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            {user?.email || "No email"}
          </p>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Role
              </span>

              <span className="rounded-full bg-white/5 px-3 py-1 font-medium text-gray-200">
                {user?.role || "User"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                User ID
              </span>

              <span className="max-w-[180px] truncate text-gray-200">
                {user?._id || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
