// // "use client";

// // import { useParams } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import { supabase } from "../../../utils/supabaseClient";

// // export default function LeaderboardPage() {
// //   const params = useParams();
// //   const gameId = params.gameId;
// //   const [scores, setScores] = useState({});

// //   useEffect(() => {
// //     const fetchScores = async () => {
// //       const { data, error } = await supabase
// //         .from("answers")
// //         .select("player_id, count(*)")
// //         .eq("game_id", gameId)
// //         .group("player_id");

// //       if (data) {
// //         const scoreObj = {};
// //         data.forEach((item) => {
// //           scoreObj[item.player_id] = item.count;
// //         });
// //         setScores(scoreObj);
// //       }
// //     };
// //     fetchScores();
// //   }, [gameId]);

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen">
// //       <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
// //       {Object.entries(scores).map(([player, score]) => (
// //         <p key={player}>
// //           {player}: {score} pts
// //         </p>
// //       ))}
// //     </div>
// //   );
// // }]"use client";
// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { supabase } from "../../../utils/supabaseClient";

// export default function LeaderboardPage() {
//   const params = useParams();
//   const gameId = params.gameId;
//   const [scores, setScores] = useState([]);

//   useEffect(() => {
//     const fetchScores = async () => {
//       // Fetch all answers for this game
//       const { data, error } = await supabase
//         .from("answers")
//         .select("player_id, answer, answered_at")
//         .eq("game_id", gameId)
//         .order("answered_at", { ascending: true });

//       if (error) {
//         console.log("Leaderboard fetch error:", error);
//         return;
//       }

//       if (!data || data.length === 0) {
//         setScores([]);
//         return;
//       }

//       // Aggregate per player
//       const playerMap = {};

//       data.forEach((ans) => {
//         const pid = ans.player_id;
//         const answeredAt = new Date(ans.answered_at);

//         if (!playerMap[pid]) {
//           playerMap[pid] = {
//             playerId: pid,
//             correctCount: 0,
//             firstAnswerTime: answeredAt,
//             lastAnswerTime: answeredAt,
//           };
//         }

//         playerMap[pid].correctCount += 1;

//         if (answeredAt < playerMap[pid].firstAnswerTime) {
//           playerMap[pid].firstAnswerTime = answeredAt;
//         }
//         if (answeredAt > playerMap[pid].lastAnswerTime) {
//           playerMap[pid].lastAnswerTime = answeredAt;
//         }
//       });

//       // Prepare array and calculate time taken in seconds
//       const scoreArr = Object.values(playerMap).map((p) => ({
//         playerId: p.playerId,
//         score: p.correctCount,
//         timeTaken:
//           (p.lastAnswerTime.getTime() - p.firstAnswerTime.getTime()) / 1000,
//       }));

//       // Sort by score desc, then fastest completion
//       scoreArr.sort((a, b) => {
//         if (b.score !== a.score) return b.score - a.score;
//         return a.timeTaken - b.timeTaken;
//       });

//       setScores(scoreArr);
//     };

//     fetchScores();
//   }, [gameId]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen space-y-4 text-black">
//       <h1 className="text-2xl font-bold text-white">Leaderboard</h1>

//       {scores.length === 0 && <p>No scores yet.</p>}

//       <div className="w-full max-w-md bg-white rounded shadow p-4">
//         <div className="flex justify-between font-bold border-b pb-2 mb-2">
//           <span>Player ID</span>
//           <span>Score</span>
//           <span>Time (s)</span>
//         </div>
//         {scores.map((p, index) => (
//           <div
//             key={p.playerId}
//             className="flex justify-between border-b py-1 last:border-b-0"
//           >
//             <span>{p.playerId}</span>
//             <span>{p.score}</span>
//             <span>{p.timeTaken.toFixed(1)}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export default function LeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId;
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);

      // Fetch all answers for this game
      const { data, error } = await supabase
        .from("answers")
        .select("player_id, answer, answered_at")
        .eq("game_id", gameId)
        .order("answered_at", { ascending: true });

      if (error) {
        console.log("Leaderboard fetch error:", error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setScores([]);
        setLoading(false);
        return;
      }

      // Aggregate per player
      const playerMap = {};

      data.forEach((ans) => {
        const pid = ans.player_id;
        const answeredAt = new Date(ans.answered_at);

        if (!playerMap[pid]) {
          playerMap[pid] = {
            playerId: pid,
            correctCount: 0,
            firstAnswerTime: answeredAt,
            lastAnswerTime: answeredAt,
          };
        }

        playerMap[pid].correctCount += 1;

        if (answeredAt < playerMap[pid].firstAnswerTime) {
          playerMap[pid].firstAnswerTime = answeredAt;
        }
        if (answeredAt > playerMap[pid].lastAnswerTime) {
          playerMap[pid].lastAnswerTime = answeredAt;
        }
      });

      // Prepare array and calculate time taken in seconds
      const scoreArr = Object.values(playerMap).map((p) => ({
        playerId: p.playerId,
        score: p.correctCount,
        timeTaken:
          (p.lastAnswerTime.getTime() - p.firstAnswerTime.getTime()) / 1000,
      }));

      // Sort by score desc, then fastest completion
      scoreArr.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

      setScores(scoreArr);
      setLoading(false);
    };

    fetchScores();
  }, [gameId]);

  const getRankIcon = (index) => {
    if (index === 0) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg shadow-gray-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg shadow-amber-600/30">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-md">
          <span className="text-gray-600 font-bold text-lg">{index + 1}</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2f7] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#144be9]/30 border-t-[#144be9] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Calculating results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2f7] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,75,233,0.08),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(20,75,233,0.05),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#144be9]/10 to-[#144be9]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#144be9]/8 to-[#144be9]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-gray-200/50 p-8 space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-xl shadow-yellow-500/30">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Final Results
              </h1>
              <p className="text-gray-600">
                Game completed! Here are the final standings.
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-4">
            {scores.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No scores recorded yet.</p>
              </div>
            ) : (
              <>
                {/* Winner Card (First Place) */}
                {scores.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(0)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🏆</span>
                            <h3 className="text-xl font-bold text-gray-900">
                              Winner!
                            </h3>
                          </div>
                          <p className="text-gray-600">
                            Player {scores[0].playerId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#144be9]">
                          {scores[0].score}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scores[0].timeTaken.toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Rankings */}
                <div className="space-y-3">
                  {scores.slice(1).map((player, index) => (
                    <div
                      key={player.playerId}
                      className="bg-white/50 border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-white/70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Player {player.playerId}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Rank #{index + 2}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#144be9]">
                            {player.score}
                          </div>
                          <div className="text-sm text-gray-500">
                            {player.timeTaken.toFixed(1)}s
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#144be9] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-medium rounded-xl shadow-lg shadow-[#144be9]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#144be9]/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center space-x-2">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Back to Home</span>
              </div>
            </button>

            <button
              onClick={() => router.push("/create")}
              className="w-full py-3 px-6 bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Play Again
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
