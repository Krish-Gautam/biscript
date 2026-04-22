import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { registerUser, resendVerificationEmail, loading, error } = useAuth();

  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return "Password must include uppercase, lowercase and a number.";
    }

    return "";
  };

  const handleResend = async () => {
    try {
      setUserError("");
      const response = await resendVerificationEmail(userEmail);
      setSuccessMessage(response?.message || "Verification email sent.");
    } catch (err) {
      setUserError(err?.message || "Failed to resend verification email.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      setUserError("");
      setSuccessMessage("");

      const response = await registerUser(
        form.username,
        form.email,
        form.password,
      );
      setUserEmail(form.email);
      setIsVerifying(true);
      setSuccessMessage(
        response?.message ||
          "Registration successful. Please verify your email.",
      );
    } catch (err) {
      setUserError(err?.message || "Sign up failed.");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1d] text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-semibold">
            Waiting for email verification...
          </h2>
          <p className="text-gray-400 text-sm text-center max-w-md">
            We've sent you a verification link. Please check your inbox and
            click the link to continue.
          </p>

          {successMessage && (
            <div className="bg-green-500/20 text-green-300 px-3 py-2 rounded text-sm text-center max-w-md">
              {successMessage}
            </div>
          )}

          {(userError || error) && (
            <div className="bg-red-500/20 text-red-300 px-3 py-2 rounded text-sm text-center max-w-md">
              {userError || error}
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={!userEmail || loading}
            className="text-blue-400 text-sm underline"
          >
            {loading ? "Sending..." : "Didn’t receive email?"}
          </button>

          <Link to="/" className="text-gray-300 text-sm underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a1a1d] to-[#2a2a2d] px-4">
        <div className="w-full max-w-md bg-[#232526] border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-white text-center mt-2 mb-2">
            Sign Up
          </h2>

          <p className="text-gray-400 text-sm text-center mb-6">
            Create your account and verify your email.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4 mt-2">
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="h-12 px-4 bg-[#2a2a2d] border border-gray-600 text-white rounded-lg"
            />

            {passwordError && (
              <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
                {passwordError}
              </div>
            )}

            {(userError || error) && (
              <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded text-sm">
                {userError || error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/20 text-green-300 px-3 py-2 rounded text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(passwordError)}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
