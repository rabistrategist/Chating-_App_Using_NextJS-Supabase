"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // 🔐 Auto Login Check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
      }
    };

    checkUser();
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar
        user={user}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      <div className="flex flex-col flex-1">
        <Navbar user={user} />
        <ChatBox activeChat={activeChat} user={user} />
      </div>
    </div>
  );
}
