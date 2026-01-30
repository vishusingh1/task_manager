import { useState } from "react";
import { AuthAPI } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const triggerError = (msg: string) => {
    setError(msg);
    setShowHelp(true);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleLogin = async () => {
    try {
      const res = await AuthAPI.login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      triggerError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await AuthAPI.register(registerForm);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      triggerError(err.response?.data?.message || "Registration failed");
    }
  };

  const switchToRegister = () => {
    // 🔑 THIS IS THE IMPORTANT PART
    setRegisterForm({
      name: "",
      email: form.email,
      password: form.password,
    });
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setForm({
      email: registerForm.email,
      password: registerForm.password,
    });
    setShowRegister(false);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Background */}
      <img
        src="/login.jpg"
        alt="login-bg"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Auth Card */}
      <div
        className={`text-white border border-white w-11/12 sm:w-[420px]
        flex flex-col p-6 rounded-lg backdrop-blur-sm bg-black/40
        ${shake ? "animate-shake" : ""}`}
      >
        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between gap-3 bg-red-500 text-white px-4 py-3 rounded mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">❗</span>
              <span>{error}</span>
            </div>
            <button
              className="text-lg font-bold cursor-pointer"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <h1 className="text-2xl font-bold">
            {showRegister ? "Create Account" : "Agent Login"}
          </h1>
          <p className="text-sm text-white/80">
            {showRegister
              ? "Register to get started"
              : "Enter your credentials to sign in"}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 mb-4 w-full">
          {showRegister && (
            <input
              value={registerForm.name}
              className="border border-white p-2 bg-transparent rounded placeholder-white/80"
              placeholder="Name"
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
            />
          )}

          <input
            value={showRegister ? registerForm.email : form.email}
            className="border border-white p-2 bg-transparent rounded placeholder-white/80"
            placeholder="Email"
            onChange={(e) =>
              showRegister
                ? setRegisterForm({ ...registerForm, email: e.target.value })
                : setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            value={showRegister ? registerForm.password : form.password}
            className="border border-white p-2 bg-transparent rounded placeholder-white/80"
            placeholder="Password"
            onChange={(e) =>
              showRegister
                ? setRegisterForm({ ...registerForm, password: e.target.value })
                : setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Action Button */}
        <button
          onClick={showRegister ? handleRegister : handleLogin}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          {showRegister ? "Sign Up" : "Sign In"}
        </button>

        {/* Help Link (ONLY after API failure) */}
        {showHelp && (
          <div className="mt-4 text-sm underline text-center cursor-pointer">
            {showRegister ? (
              <span onClick={switchToLogin}>
                Already have an account? Login
              </span>
            ) : (
              <span onClick={switchToRegister}>
                Having trouble signing in? Register
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
