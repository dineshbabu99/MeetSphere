import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser } from "../../store/slices/registerSlice";



export default function Register() {
const dispatch =
  useAppDispatch();

const {loading, error,} = useAppSelector((state) => state.register);

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  // const [loading, setLoading] =
  //   useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleRegister = async (
  e: React.FormEvent<HTMLFormElement>
) => {

  e.preventDefault();

  if (
    formData.password !==
    formData.confirmPassword
  ) {
    alert("Passwords do not match");

    return;
  }

  const result =
    await dispatch(
      registerUser({
        name: formData.name,

        email: formData.email,

        password:
          formData.password,
      })
    );

  if (
    registerUser.fulfilled.match(
      result
    )
  ) {

    alert(
      "Account created successfully!"
    );

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    navigate("/login");
  }
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
            Create your account and start
            managing amazing events.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
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
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm text-gray-400">
            
            <input
              type="checkbox"
              required
              className="mt-1 rounded border-white/20 bg-transparent"
            />

            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-violet-400 hover:text-violet-300"
              >
                Terms & Conditions
              </button>
            </span>
          </label>

{
  error && (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      {error}
    </div>
  )
}


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
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          
          <Link
            to="/login"
            className="font-medium text-violet-400 transition-all hover:text-violet-300"
          >
            Sign in
          </Link>
        </p>

        {/* Divider */}
        {/* <div className="my-8 flex items-center">
          
          <div className="h-px flex-1 bg-white/10"></div>

          <span className="px-4 text-sm text-gray-500">
            OR REGISTER WITH
          </span>

          <div className="h-px flex-1 bg-white/10"></div>
        </div> */}

        {/* Socials */}
        {/* <div className="flex justify-center gap-4">
          
          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🌐
          </button>

          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🐦
          </button>

          <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition-all hover:bg-white/10">
            🟠
          </button>
        </div> */}
      </div>
    </div>
  );
}