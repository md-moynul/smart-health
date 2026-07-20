"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/chat`,
    }),
  });
  console.log("Messages:", messages);

  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 transition-transform hover:scale-110 active:scale-95"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-125 w-87.5 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-100">
          {/* Header */}
          <div className="flex items-center justify-between bg-teal-600 px-4 py-3 text-white">
            <div>
              <h3 className="font-semibold">SmartHealth Assistant</h3>
              <p className="text-xs text-teal-100">AI-powered support</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-teal-100 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-gray-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Bot size={24} />
                </div>
                <p className="text-sm">Hi! I&apos;m your SmartHealth assistant. How can I help you today?</p>
              </div>
            ) : (
              messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}

            {isLoading && (
              <div className="flex w-full gap-3 py-3 flex-row">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-teal-600">
                  <Bot size={16} />
                </div>
                <div className="flex flex-col gap-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="my-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                An error occurred. Please try again.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our medicines..."
                className="flex-1 bg-transparent text-sm outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
