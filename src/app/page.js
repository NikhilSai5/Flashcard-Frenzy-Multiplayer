"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) setUser(session.user);
        else router.push("/login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6 text-black">
      {user && (
        <>
          <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/create")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Create Game
            </button>
            <button
              onClick={() => router.push("/join")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Join Game
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
