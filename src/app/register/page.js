// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../utils/supabaseClient";
// import Link from "next/link";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) router.push("/");
//     };
//     checkUser();
//   }, [router]);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) setErrorMsg(error.message);
//     else router.push("/login");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleRegister}
//         className="bg-white p-8 rounded-lg shadow-md w-80"
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         {errorMsg && <p className="text-red-600 text-sm mb-4">{errorMsg}</p>}
//         <button
//           type="submit"
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded"
//         >
//           Register
//         </button>
//         <p className="text-sm text-gray-600 mt-4">
//           Already have an account?{" "}
//           <Link href="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.push("/");
    };
    checkUser();
  }, [router]);

  const validatePassword = (pass) => {
    return pass.length >= 6;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMsg("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(
        "Account created successfully! Please check your email to verify your account."
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #f3f2f7 0%, #e8e6f0 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ backgroundColor: "#144be9" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: "#144be9" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-30"
          style={{
            backgroundColor: "#144be9",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Main register card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(20, 75, 233, 0.15), 0 0 0 1px rgba(255,255,255,0.8)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#144be9" }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us and start your journey today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  style={{
                    boxShadow: email ? "0 0 0 2px #144be9" : "none",
                    borderColor: email ? "#144be9" : "#e5e7eb",
                  }}
                  required
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            {/* Password input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  style={{
                    boxShadow: password ? "0 0 0 2px #144be9" : "none",
                    borderColor: password ? "#144be9" : "#e5e7eb",
                  }}
                  required
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center text-xs">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        validatePassword(password)
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={
                        validatePassword(password)
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  style={{
                    boxShadow: confirmPassword ? "0 0 0 2px #144be9" : "none",
                    borderColor: confirmPassword ? "#144be9" : "#e5e7eb",
                  }}
                  required
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showConfirmPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {confirmPassword && password && (
                <div className="mt-2">
                  <div className="flex items-center text-xs">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        password === confirmPassword
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={
                        password === confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {password === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Success message */}
            {successMsg && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-green-700 text-sm">{successMsg}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Register button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#144be9",
                boxShadow: "0 10px 25px rgba(20, 75, 233, 0.3)",
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-2xl border-2 transition-all duration-300 hover:shadow-md"
                style={{
                  color: "#144be9",
                  borderColor: "#144be9",
                }}
              >
                Sign In Instead
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
