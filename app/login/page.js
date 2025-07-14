import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-[#2f3133] p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form className="flex flex-col gap-4">
          <input
            className="h-12 px-4 bg-[#3d4042] text-white placeholder-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            type="email"
            placeholder="Email"
          />

          <input
            className="h-12 px-4 bg-[#3d4042] text-white placeholder-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            type="password"
            placeholder="Password"
          />

          <button
            type="submit"
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
