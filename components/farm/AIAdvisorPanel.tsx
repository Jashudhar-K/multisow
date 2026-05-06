'use client'

import React, { useState, useRef, useEffect } from "react";
import { Icon } from '@/components/ui/Icon';
import { useAIFarm } from '@/context/AIFarmContext';

import { useLanguage } from '@/context/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAdvisorPanel() {
  const { currentFarm } = useAIFarm();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('ai_advisor.title') ? `Hello! I am your AI Farm Advisor.` : 'Hello! I am your AI Farm Advisor.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/nlp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          farm_context: currentFarm || undefined
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Failed to connect to the advisor." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-glass rounded-xl shadow-lg border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
        <Icon name="smart_toy" className="text-green-400" size={24} />
        <div>
          <h2 className="text-lg font-bold text-white">{t('ai_advisor.title')}</h2>
          <p className="text-xs text-white/50">{t('ai_advisor.subtitle')}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-green-600/80 text-white rounded-br-sm' : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'}`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white/90 p-4 rounded-2xl rounded-bl-sm border border-white/5 flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder={t('ai_advisor.placeholder')} 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-400 text-black p-3 rounded-xl transition-colors disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <Icon name="send" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
