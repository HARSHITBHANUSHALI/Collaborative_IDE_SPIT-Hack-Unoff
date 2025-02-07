import React from "react";
import { SparklesCore } from "../components/ui/sparkles";

const Signup = () => {
  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      {/* Sparkles Background */}
      <div className="absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      
      {/* Signup Form Centered */}
      <div className="relative z-10 flex justify-center items-center w-full p-10">
        <div className="w-full max-w-md bg-black/50 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-4">Sign up</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium my-1">Email</label>
              <input
                type="email"
                className="w-full p-2 bg-black/50 border border-white/20 rounded-md focus:ring focus:ring-white/30 text-white placeholder-white/50"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium my-1">Password</label>
              <input
                type="password"
                className="w-full p-2 bg-black/50 border border-white/20 rounded-md focus:ring focus:ring-white/30 text-white placeholder-white/50"
                placeholder="Password"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Password should be at least 15 characters OR at least 8 characters
                including a number and a lowercase letter.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium my-1">Username</label>
              <input
                type="text"
                className="w-full p-2 bg-black/50 border border-white/20 rounded-md focus:ring focus:ring-white/30 text-white placeholder-white/50"
                placeholder="Username"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black p-2 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Continue →
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{" "}
            and our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;