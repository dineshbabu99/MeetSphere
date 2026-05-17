import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      if (
        email ===
          "admin@meetsphere.com" &&
        password === "admin"
      ) {
        dispatch(
          login({
            token: "admin-token",
            user: {
              name: "Admin User",
              email,
              role: "Admin",
            },
          })
        );

        navigate("/");
      } else if (
        email ===
          "user@meetsphere.com" &&
        password === "user"
      ) {
        dispatch(
          login({
            token: "user-token",
            user: {
              name: "Client User",
              email,
              role: "User",
            },
          })
        );

        navigate("/");
      } else {
        alert("Invalid credentials");
      }

      setLoading(false);
    }, 1000);
  };

 return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a16] px-6 text-white">
      
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111122] p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="mb-8 text-center">
          
          <h1 className="text-4xl font-black text-violet-400">
            MeetSphere
          </h1>

          <p className="mt-3 text-gray-400">
            Sign in to continue managing
            your events and attendees.
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
          
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-300">
            Demo Accounts
          </h3>

          <div className="space-y-3 text-sm">
            
            <div className="rounded-xl bg-black/20 p-3">
              
              <p className="font-medium text-white">
                Admin Account
              </p>

              <p className="mt-1 text-gray-400">
                admin@meetsphere.com / admin
              </p>
            </div>

            <div className="rounded-xl bg-black/20 p-3">
              
              <p className="font-medium text-white">
                Client Account
              </p>

              <p className="mt-1 text-gray-400">
                user@meetsphere.com / user
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            
            <label className="flex items-center gap-2 text-gray-400">
              
              <input
                type="checkbox"
                className="rounded border-white/20 bg-transparent"
              />

              Remember me
            </label>

            <button
              type="button"
              className="text-violet-400 transition-all hover:text-violet-300"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-2xl py-4 text-lg font-semibold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-600"
                : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          
          <Link
            to="/register"
            className="font-medium text-violet-400 transition-all hover:text-violet-300"
          >
            Create account
          </Link>
        </p>

        {/* Divider */}
        <div className="my-8 flex items-center">
          
          <div className="h-px flex-1 bg-white/10"></div>

          <span className="px-4 text-sm text-gray-500">
            OR CONTINUE WITH
          </span>

          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-4">
          
          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🌐
          </button>

          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🐦
          </button>

          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🟠
          </button>
        </div>
      </div>
    </div>
  );
}