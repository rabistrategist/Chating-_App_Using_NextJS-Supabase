"use client";
import {Bot} from "lucide-react"
import {User} from "lucide-react"
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ user }: any) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const avatar = user?.user_metadata?.avatar_url || null;
  const name =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0];

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-pink-100 shadow-md relative">
      <h1 className="font-bold text-lg flex gap-2"> <Bot/> AI Chatbot</h1>

      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Profile Image */}
        {avatar ? (
          <img
            src={avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-black shadow cursor-pointer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center font-bold shadow cursor-pointer">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-0.5 w-48 bg-white border border-black rounded-lg shadow-lg p-3 animate-fadeIn">
            <p className="font-semibold text-black mb-2 truncate">
              {name}
            </p>

            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-2 flex gap-2 rounded-md hover:cursor-pointer hover:bg-red-700 hover:text-white transition"
            > <User/>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
