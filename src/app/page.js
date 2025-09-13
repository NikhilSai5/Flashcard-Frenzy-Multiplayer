// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../utils/supabaseClient";

// export default function Home() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();
//       if (error || !user) {
//         router.push("/login");
//       } else {
//         setUser(user);
//       }
//     };
//     fetchUser();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (session?.user) setUser(session.user);
//         else router.push("/login");
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, [router]);

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) alert(error.message);
//     else router.push("/login");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6 text-black">
//       {user && (
//         <>
//           <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
//           <div className="space-x-4">
//             <button
//               onClick={() => router.push("/create")}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded"
//             >
//               Create Game
//             </button>
//             <button
//               onClick={() => router.push("/join")}
//               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded"
//             >
//               Join Game
//             </button>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded"
//           >
//             Logout
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setLoading(false);
        } else {
          router.push("/login");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-r-blue-300 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none"></div>

      {user && (
        <div className="relative w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl shadow-gray-200/50 p-8 space-y-8">
            {/* User Info */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-semibold">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/create")}
                className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/50 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create Game</span>
                </div>
              </button>

              <button
                onClick={() => router.push("/join")}
                className="group relative w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-5 h-5"
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
                  <span>Join Game</span>
                </div>
              </button>
            </div>

            {/* Logout */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-reverse {
          animation: reverse 1s linear infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
