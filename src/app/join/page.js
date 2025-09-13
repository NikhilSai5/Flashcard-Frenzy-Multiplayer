// "use client";

// import { useState } from "react";
// import { supabase } from "../../utils/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function JoinGame() {
//   const [gameId, setGameId] = useState("");
//   const router = useRouter();

//   const joinGame = async () => {
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();
//     if (userError) return alert(userError.message);

//     const { data: game, error } = await supabase
//       .from("games")
//       .select("*")
//       .eq("id", gameId)
//       .single();
//     if (error) return alert(error.message);
//     if (game.status !== "waiting") return alert("Game already started");

//     await supabase.from("players").insert({
//       game_id: gameId,
//       user_id: user.id,
//       score: 0,
//     });

//     router.push(`/game/${gameId}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4 text-black">
//       <input
//         type="text"
//         placeholder="Enter Game ID"
//         value={gameId}
//         onChange={(e) => setGameId(e.target.value)}
//         className="px-3 py-2 border rounded w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={joinGame}
//         className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Join Game
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function JoinGame() {
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joinGame = async () => {
    if (!gameId.trim()) return alert("Please enter a Game ID");

    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      setLoading(false);
      return alert(userError.message);
    }

    const { data: game, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();
    if (error) {
      setLoading(false);
      return alert(error.message);
    }
    if (game.status !== "waiting") {
      setLoading(false);
      return alert("Game already started");
    }

    await supabase.from("players").insert({
      game_id: gameId,
      user_id: user.id,
      score: 0,
    });

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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Join Game
              </h1>
              <p className="text-gray-600 text-sm">
                Enter the game ID to join an existing game
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Game ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Game ID"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#144be9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>

              <button
                onClick={joinGame}
                disabled={loading || !gameId.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#144be9] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-medium rounded-xl shadow-lg shadow-[#144be9]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#144be9]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining...</span>
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Join Game</span>
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

          {/* Footer Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={() => router.push("/create")}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
            >
              Create a new game instead
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
