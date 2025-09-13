// "use client";

// import { useState } from "react";
// import { supabase } from "../../utils/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function CreateGame() {
//   const router = useRouter();
//   const [gameId, setGameId] = useState(null);

//   const createGame = async () => {
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();
//     if (userError) return alert(userError.message);

//     const { data, error } = await supabase
//       .from("games")
//       .insert({ host_id: user.id, status: "waiting" })
//       .select()
//       .single();
//     if (error) return alert(error.message);

//     await supabase.from("players").insert({
//       game_id: data.id,
//       user_id: user.id,
//       score: 0,
//     });

//     setGameId(data.id);
//   };

//   const startGame = async () => {
//     await supabase.from("games").update({ status: "started" }).eq("id", gameId);
//     router.push(`/game/${gameId}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4 text-black">
//       {!gameId ? (
//         <button
//           onClick={createGame}
//           className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Create Game
//         </button>
//       ) : (
//         <div className="flex flex-col items-center space-y-2">
//           <p>Game created! ID: {gameId}</p>
//           <button
//             onClick={startGame}
//             className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Start Game
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateGame() {
  const router = useRouter();
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(false);

  const createGame = async () => {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      setLoading(false);
      return alert(userError.message);
    }

    const { data, error } = await supabase
      .from("games")
      .insert({ host_id: user.id, status: "waiting" })
      .select()
      .single();
    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    await supabase.from("players").insert({
      game_id: data.id,
      user_id: user.id,
      score: 0,
    });

    setGameId(data.id);
    setLoading(false);
  };

  const startGame = async () => {
    setLoading(true);
    await supabase.from("games").update({ status: "started" }).eq("id", gameId);
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f2f7] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,75,233,0.08),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(20,75,233,0.05),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#144be9]/10 to-[#144be9]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#144be9]/8 to-[#144be9]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-gray-200/50 p-8 space-y-8 relative z-10">
          {!gameId ? (
            // Create Game State
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#144be9] to-[#2563eb] rounded-full mx-auto flex items-center justify-center shadow-lg shadow-[#144be9]/20">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Create Game
                </h1>
                <p className="text-gray-600 text-sm">
                  Start a new game session
                </p>
              </div>

              <button
                onClick={createGame}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#144be9] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-medium rounded-xl shadow-lg shadow-[#144be9]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#144be9]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
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
                )}
              </button>
            </div>
          ) : (
            // Game Created State
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/20">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Game Created
                </h1>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-600 text-sm mb-2">Game ID</p>
                  <div className="font-mono text-lg text-gray-900 bg-white rounded-lg p-3 border border-gray-200">
                    {gameId}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={startGame}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Starting...</span>
                    </div>
                  ) : (
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
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m0 0H7m2 0h3m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Start Game</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full py-4 px-6 bg-white hover:bg-gray-50 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Logout Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
