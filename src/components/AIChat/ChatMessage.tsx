import React from 'react';
import { Bot, User } from 'lucide-react';
import type { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full gap-3 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-teal-600 text-white' : 'bg-gray-100 text-teal-600'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={`flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? 'bg-teal-600 text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {getMessageText(message)}
        </div>
      </div>
    </div>
  );
};
