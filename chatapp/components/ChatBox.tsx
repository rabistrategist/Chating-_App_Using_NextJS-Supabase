"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ activeChat, user }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (activeChat) fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", activeChat)
      .order("created_at");

    setMessages(data || []);
  };

/*
const sendMessage = async () => {
  if (!input.trim() || !activeChat) return;

  const userMessage = input;
  setInput("");

  // Check if this is first message
  const { data: existingMessages } = await supabase
    .from("messages")
    .select("id")
    .eq("chat_id", activeChat);

  const isFirstMessage = existingMessages?.length === 0;

  // Save user message
  await supabase.from("messages").insert([
    {
      chat_id: activeChat,
      role: "user",
      content: userMessage,
    },
  ]);

  // 🏷 Generate and update title if first message
  if (isFirstMessage) {
    const newTitle = generateTitle(userMessage);

    await supabase
      .from("chats")
      .update({ title: newTitle })
      .eq("id", activeChat);
  }

  // Call Gemini
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await res.json();

  // Save assistant reply
  await supabase.from("messages").insert([
    {
      chat_id: activeChat,
      role: "assistant",
      content: data.reply,
    },
  ]);

  fetchMessages();
};
*/
const sendMessage = async () => {
  if (!input.trim() || !activeChat) return;

  const userMessage = input;
  setInput("");
  
// Check if this is first message
  const { data: existingMessages } = await supabase
    .from("messages")
    .select("id")
    .eq("chat_id", activeChat);

  const isFirstMessage = existingMessages?.length === 0;
  // 🔥 1. Instantly show user message (optimistic UI)
  const tempUserMessage = {
    id: Date.now(),
    role: "user",
    content: userMessage,
  };

  setMessages((prev) => [...prev, tempUserMessage]);

  setIsTyping(true);

  // 🔹 Save user message to DB (background)
  await supabase.from("messages").insert([
    {
      chat_id: activeChat,
      role: "user",
      content: userMessage,
    },
  ]);
 // 🏷 Generate and update title if first message
  if (isFirstMessage) {
    const newTitle = generateTitle(userMessage);

    await supabase
      .from("chats")
      .update({ title: newTitle })
      .eq("id", activeChat);
  }

  // 🔹 Call Gemini
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await res.json();

  setIsTyping(false);

  // 🔥 2. Show assistant message instantly
  const assistantMessage = {
    id: Date.now() + 1,
    role: "assistant",
    content: data.reply,
  };

  setMessages((prev) => [...prev, assistantMessage]);

  // 🔹 Save assistant message to DB
  await supabase.from("messages").insert([
    {
      chat_id: activeChat,
      role: "assistant",
      content: data.reply,
    },
  ]);
  fetchMessages();
};

  if (!activeChat)
    return (
      <div className="flex-1 flex items-center justify-center">
        Hi! Welcome Back👋 <br/>
        Select or create a chat
      </div>
    );
const generateTitle = (message: string) => {
  const cleaned = message
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(" ")
    .slice(0, 5)
    .join(" ");

  return cleaned || "New Chat";
};

  return (
    <div className="flex flex-col flex-1 p-6">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-black rounded-lg p-3"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-700 text-white px-6 rounded-lg shadow hover:shadow-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
