"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Trash } from "lucide-react";

export default function Sidebar({ user, activeChat, setActiveChat }: any) {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setChats(data || []);
  };

  const createNewChat = async () => {
    const { data } = await supabase
      .from("chats")
      .insert([{ user_id: user.id, title: "New Chat" }])
      .select();
      fetchChats();

    if (data) {
      setActiveChat(data[0].id);
      fetchChats();
    }
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);

    if (activeChat === id) setActiveChat(null);
    fetchChats();
  };

  return (
    <div className="w-64 bg-pink-50 border-r border-gray-300 p-4 flex flex-col">
      <button
        onClick={createNewChat}
        className="bg-black text-white p-2 rounded-lg shadow hover:shadow-lg transition mb-4"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex justify-between items-center p-2 bg-white rounded-lg cursor-pointer shadow-md hover:shadow-md ${
              activeChat === chat.id ? "border border-gray-400" : ""
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <span className="truncate">{chat.title}</span>
            <Trash
              className="text-green-700 hover:text-red-600"
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
