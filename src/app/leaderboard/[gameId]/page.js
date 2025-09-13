// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { supabase } from "../../../utils/supabaseClient";

// export default function LeaderboardPage() {
//   const params = useParams();
//   const gameId = params.gameId;
//   const [scores, setScores] = useState({});

//   useEffect(() => {
//     const fetchScores = async () => {
//       const { data, error } = await supabase
//         .from("answers")
//         .select("player_id, count(*)")
//         .eq("game_id", gameId)
//         .group("player_id");

//       if (data) {
//         const scoreObj = {};
//         data.forEach((item) => {
//           scoreObj[item.player_id] = item.count;
//         });
//         setScores(scoreObj);
//       }
//     };
//     fetchScores();
//   }, [gameId]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
//       {Object.entries(scores).map(([player, score]) => (
//         <p key={player}>
//           {player}: {score} pts
//         </p>
//       ))}
//     </div>
//   );
// }]"use client";
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export default function LeaderboardPage() {
  const params = useParams();
  const gameId = params.gameId;
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      // Fetch all answers for this game
      const { data, error } = await supabase
        .from("answers")
        .select("player_id, answer, answered_at")
        .eq("game_id", gameId)
        .order("answered_at", { ascending: true });

      if (error) {
        console.log("Leaderboard fetch error:", error);
        return;
      }

      if (!data || data.length === 0) {
        setScores([]);
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
    };

    fetchScores();
  }, [gameId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 text-black">
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>

      {scores.length === 0 && <p>No scores yet.</p>}

      <div className="w-full max-w-md bg-white rounded shadow p-4">
        <div className="flex justify-between font-bold border-b pb-2 mb-2">
          <span>Player ID</span>
          <span>Score</span>
          <span>Time (s)</span>
        </div>
        {scores.map((p, index) => (
          <div
            key={p.playerId}
            className="flex justify-between border-b py-1 last:border-b-0"
          >
            <span>{p.playerId}</span>
            <span>{p.score}</span>
            <span>{p.timeTaken.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
