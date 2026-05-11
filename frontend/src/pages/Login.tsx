import React, { useState } from "react";
import { useNavigate } from "react-router-dom";








export default function Login() {

   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "admin@meetsphere.com" && password === "admin") {
      localStorage.setItem("token", "my-token");
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };


  return (
    <div className="flex min-h-screen bg-[#2b2f4b] text-white items-center justify-center">
      
   

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        
        <div className="w-full max-w-md">
          

          <h1 className="text-3xl font-bold">
            Welcome to MeetSphere 👋
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Please sign in to your account and start the adventure
          </p>

          <div className="mt-6 rounded-xl bg-[#3a3f63] p-4 text-sm text-[#a7a9c3]">
            <p>Admin: admin@meetsphere.com / Pass: admin</p>
            <p className="mt-1">
              Client: user@meetsphere.com / Pass: user
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#444969] bg-transparent px-4 py-3 outline-none transition focus:border-[#7c6df4]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#444969] bg-transparent px-4 py-3 outline-none transition focus:border-[#7c6df4]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="text-[#7c6df4] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#7c6df4] py-3 font-semibold transition hover:opacity-90"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            New on our platform?{" "}
            <span className="cursor-pointer text-[#7c6df4] hover:underline">
              Create an account
            </span>
          </p>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-[#444969]"></div>

            <span className="px-4 text-sm text-gray-400">
              or
            </span>

            <div className="h-px flex-1 bg-[#444969]"></div>
          </div>

          <div className="flex justify-center gap-5 text-xl text-gray-400">
            <button>🌐</button>
            <button>🐦</button>
            <button>🟠</button>
          </div>
        </div>
      </div>
    </div>
  );
}


