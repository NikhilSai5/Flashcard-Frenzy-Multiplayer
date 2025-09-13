// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../../utils/supabaseClient";
// import { useRouter, useParams } from "next/navigation";

// const questions = [
//   {
//     q: "What is 2+2?",
//     options: ["3", "4", "5", "6"],
//     answer: "4",
//   },
//   {
//     q: "Capital of France?",
//     options: ["London", "Berlin", "Paris", "Rome"],
//     answer: "Paris",
//   },
//   {
//     q: "Largest planet?",
//     options: ["Earth", "Mars", "Jupiter", "Venus"],
//     answer: "Jupiter",
//   },
// ];

// export default function GamePage() {
//   const router = useRouter();
//   const params = useParams();
//   const gameId = params.gameId;

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [scores, setScores] = useState({});
//   const [user, setUser] = useState(null);
//   const [playerId, setPlayerId] = useState(null); // Store players.id

//   // Fetch authenticated user
//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (error || !data.user) return router.push("/login");
//       setUser(data.user);

//       // Insert into players if not exists
//       const { data: existingPlayer, error: fetchError } = await supabase
//         .from("players")
//         .select("*")
//         .eq("game_id", gameId)
//         .eq("user_id", data.user.id)
//         .single();

//       if (fetchError && fetchError.code !== "PGRST116") {
//         // PGRST116 = no rows returned
//         console.log("Player fetch error:", fetchError);
//         return;
//       }

//       if (existingPlayer) {
//         setPlayerId(existingPlayer.id);
//       } else {
//         // Insert new player
//         const { data: newPlayer, error: insertError } = await supabase
//           .from("players")
//           .insert({ game_id: gameId, user_id: data.user.id, score: 0 })
//           .select()
//           .single();

//         if (insertError) {
//           console.log("Insert player error:", insertError);
//           return;
//         }

//         setPlayerId(newPlayer.id);
//       }
//     };

//     fetchUser();
//   }, [gameId, router]);

//   // Real-time leaderboard subscription
//   useEffect(() => {
//     if (!gameId) return;

//     const channel = supabase
//       .channel("realtime-answers")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "answers",
//           filter: `game_id=eq.${gameId}`,
//         },
//         (payload) => {
//           const { player_id } = payload.new;
//           setScores((prev) => ({
//             ...prev,
//             [player_id]: (prev[player_id] || 0) + 1,
//           }));
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [gameId]);

//   //   const submitAnswer = async (selectedOption) => {
//   //     if (!user || !playerId) return;

//   //     const isCorrect =
//   //       selectedOption.trim().toLowerCase() ===
//   //       questions[currentQuestion].answer.toLowerCase();

//   //     // Save only correct answers
//   //     if (isCorrect) {
//   //       const { data, error } = await supabase.from("answers").insert({
//   //         game_id: gameId,
//   //         player_id: playerId, // ✅ Correctly referencing players.id
//   //         question_no: currentQuestion + 1,
//   //         answer: selectedOption,
//   //       });

//   //       if (error) {
//   //         console.log("Insert Answer Error:", error);
//   //         alert("Failed to record answer. Check console.");
//   //       } else {
//   //         console.log("Answer recorded:", data);
//   //       }
//   //     }

//   //     // Move to next question regardless of correctness
//   //     if (currentQuestion + 1 < questions.length) {
//   //       setCurrentQuestion(currentQuestion + 1);
//   //     } else {
//   //       router.push(`/leaderboard/${gameId}`);
//   //     }
//   //   };

//   const submitAnswer = async (selectedOption) => {
//     if (!user || !playerId) return;

//     const currentQ = currentQuestion + 1;

//     // Check if the answer is correct
//     const isCorrect =
//       selectedOption.trim().toLowerCase() ===
//       questions[currentQuestion].answer.toLowerCase();

//     let marks = 0; // default score

//     if (isCorrect) {
//       // Check if anyone has already answered this question correctly
//       const { data: existingAnswers, error: fetchError } = await supabase
//         .from("answers")
//         .select("*")
//         .eq("game_id", gameId)
//         .eq("question_no", currentQ);

//       if (fetchError) {
//         console.log("Error checking existing answers:", fetchError);
//       }

//       // Assign marks
//       if (!existingAnswers || existingAnswers.length === 0) {
//         // First correct answer
//         marks = 2;
//       } else {
//         // Someone already answered this question
//         marks = 1;
//       }

//       // Insert the correct answer into answers table
//       const { data: answerData, error: insertError } = await supabase
//         .from("answers")
//         .insert({
//           game_id: gameId,
//           player_id: playerId,
//           question_no: currentQ,
//           answer: selectedOption,
//         });

//       if (insertError) {
//         console.log("Error inserting answer:", insertError);
//       } else {
//         console.log("Answer recorded:", answerData);
//       }
//     }

//     // Update player's total score
//     const { data: playerData, error: updateError } = await supabase
//       .from("players")
//       .select("score")
//       .eq("id", playerId)
//       .single();

//     if (updateError) {
//       console.log("Error fetching player score:", updateError);
//     } else {
//       const currentScore = playerData?.score || 0;
//       const newScore = currentScore + marks;

//       const { error: scoreUpdateError } = await supabase
//         .from("players")
//         .update({ score: newScore })
//         .eq("id", playerId);

//       if (scoreUpdateError)
//         console.log("Error updating player score:", scoreUpdateError);
//       else console.log(`Player score updated: +${marks} points`);
//     }

//     // Move to next question
//     if (currentQuestion + 1 < questions.length) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       router.push(`/leaderboard/${gameId}`);
//     }
//   };

//   if (!user || !playerId) return null;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6 text-black">
//       <h1 className="text-xl font-bold">{questions[currentQuestion].q}</h1>
//       <div className="flex flex-col space-y-2">
//         {questions[currentQuestion].options.map((option) => (
//           <button
//             key={option}
//             onClick={() => submitAnswer(option)}
//             className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <div className="mt-6 w-60 bg-white p-4 rounded shadow">
//         <h2 className="font-bold mb-2">Leaderboard</h2>
//         {Object.entries(scores).length === 0 && <p>No scores yet.</p>}
//         {Object.entries(scores).map(([player, score]) => (
//           <p key={player}>
//             {player}: {score} pts
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useRouter, useParams } from "next/navigation";

const questions = [
  {
    q: "What is 2+2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    q: "Capital of France?",
    options: ["London", "Berlin", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    q: "Largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Jupiter",
  },
];

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [user, setUser] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return router.push("/login");
      setUser(data.user);

      // Insert into players if not exists
      const { data: existingPlayer, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId)
        .eq("user_id", data.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.log("Player fetch error:", fetchError);
        return;
      }

      if (existingPlayer) {
        setPlayerId(existingPlayer.id);
      } else {
        const { data: newPlayer, error: insertError } = await supabase
          .from("players")
          .insert({ game_id: gameId, user_id: data.user.id, score: 0 })
          .select()
          .single();

        if (insertError) {
          console.log("Insert player error:", insertError);
          return;
        }

        setPlayerId(newPlayer.id);
      }
    };

    fetchUser();
  }, [gameId, router]);

  // Real-time leaderboard subscription
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel("realtime-answers")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answers",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const { player_id } = payload.new;
          setScores((prev) => ({
            ...prev,
            [player_id]: (prev[player_id] || 0) + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const submitAnswer = async (selectedOption) => {
    if (!user || !playerId || loading) return;

    setLoading(true);
    const currentQ = currentQuestion + 1;

    // Check if the answer is correct
    const isCorrect =
      selectedOption.trim().toLowerCase() ===
      questions[currentQuestion].answer.toLowerCase();

    let marks = 0;

    if (isCorrect) {
      const { data: existingAnswers, error: fetchError } = await supabase
        .from("answers")
        .select("*")
        .eq("game_id", gameId)
        .eq("question_no", currentQ);

      if (fetchError) {
        console.log("Error checking existing answers:", fetchError);
      }

      if (!existingAnswers || existingAnswers.length === 0) {
        marks = 2;
      } else {
        marks = 1;
      }

      const { data: answerData, error: insertError } = await supabase
        .from("answers")
        .insert({
          game_id: gameId,
          player_id: playerId,
          question_no: currentQ,
          answer: selectedOption,
        });

      if (insertError) {
        console.log("Error inserting answer:", insertError);
      } else {
        console.log("Answer recorded:", answerData);
      }
    }

    // Update player's total score
    const { data: playerData, error: updateError } = await supabase
      .from("players")
      .select("score")
      .eq("id", playerId)
      .single();

    if (updateError) {
      console.log("Error fetching player score:", updateError);
    } else {
      const currentScore = playerData?.score || 0;
      const newScore = currentScore + marks;

      const { error: scoreUpdateError } = await supabase
        .from("players")
        .update({ score: newScore })
        .eq("id", playerId);

      if (scoreUpdateError)
        console.log("Error updating player score:", scoreUpdateError);
      else console.log(`Player score updated: +${marks} points`);
    }

    // Move to next question
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        router.push(`/leaderboard/${gameId}`);
      }
      setLoading(false);
    }, 1000);
  };

  if (!user || !playerId) {
    return (
      <div className="min-h-screen bg-[#f3f2f7] flex items-center justify-center px-6">
        <div className="w-8 h-8 border-2 border-[#144be9]/30 border-t-[#144be9] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2f7] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,75,233,0.08),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(20,75,233,0.05),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#144be9]/10 to-[#144be9]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#144be9]/8 to-[#144be9]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-gray-200/50 p-8 space-y-8 relative z-10">
              <div className="text-center space-y-6">
                {/* Question Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#144be9] to-[#2563eb] rounded-full flex items-center justify-center shadow-lg shadow-[#144be9]/20">
                      <span className="text-white font-bold text-sm">
                        {currentQuestion + 1}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      of {questions.length}
                    </span>
                  </div>

                  <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                    {questions[currentQuestion].q}
                  </h1>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => submitAnswer(option)}
                      disabled={loading}
                      className="group relative p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#144be9] rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#144be9]/10 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#144be9] rounded-full flex items-center justify-center transition-colors duration-300">
                          <span className="text-gray-600 group-hover:text-white font-medium text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {loading && (
                  <div className="flex items-center justify-center space-x-2 text-[#144be9]">
                    <div className="w-4 h-4 border-2 border-[#144be9]/30 border-t-[#144be9] rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-gray-200/50 p-6 space-y-6 relative z-10">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Leaderboard
                </h2>
              </div>

              <div className="space-y-3">
                {Object.entries(scores).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
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
                    <p className="text-gray-500 text-sm">
                      Waiting for players to answer...
                    </p>
                  </div>
                ) : (
                  Object.entries(scores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([player, score], index) => (
                      <div
                        key={player}
                        className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                ? "bg-amber-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-gray-900 font-medium text-sm">
                            Player {player}
                          </span>
                        </div>
                        <span className="text-[#144be9] font-bold">
                          {score} pts
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
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
