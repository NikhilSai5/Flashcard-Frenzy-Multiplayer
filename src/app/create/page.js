"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateGame() {
  const router = useRouter();
  const [gameId, setGameId] = useState(null);

  const createGame = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) return alert(userError.message);

    const { data, error } = await supabase
      .from("games")
      .insert({ host_id: user.id, status: "waiting" })
      .select()
      .single();
    if (error) return alert(error.message);

    await supabase.from("players").insert({
      game_id: data.id,
      user_id: user.id,
      score: 0,
    });

    setGameId(data.id);
  };

  const startGame = async () => {
    await supabase.from("games").update({ status: "started" }).eq("id", gameId);
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4 text-black">
      {!gameId ? (
        <button
          onClick={createGame}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Game
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <p>Game created! ID: {gameId}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
