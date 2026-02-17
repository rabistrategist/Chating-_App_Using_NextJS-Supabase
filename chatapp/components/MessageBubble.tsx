export default function MessageBubble({ message }: any) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-lg p-3 rounded-[30px] shadow ${
        isUser
          ? "ml-auto bg-blue-700 w-fit pl-8 pr-8  text-white"
          : "bg-pink-100 w-fit pl-8 pr-8 "
      }`}
    >
      {message.content}
    </div>
  );
}
