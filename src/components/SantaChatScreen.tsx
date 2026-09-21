import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, Sparkles, ChevronLeft } from 'lucide-react';
import type { ChildProfile, ChatMessage } from '../types';
import { SUGGESTED_QUESTIONS, getSantaReply } from '../data/chatKnowledge';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';

interface SantaChatScreenProps {
  profile: ChildProfile;
  onBack?: () => void;
}

export const SantaChatScreen: React.FC<SantaChatScreenProps> = ({ profile, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getChatMessages());
  const [inputText, setInputText] = useState('');
  const [isSantaTyping, setIsSantaTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSantaTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    soundManager.playBell(700, 0.15, 'sine', 0.2);
    soundManager.triggerVibrate();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    storage.saveChatMessages(updated);
    setInputText('');

    // Santa typing effect
    setIsSantaTyping(true);

    setTimeout(() => {
      const reply = getSantaReply(text, profile);
      const santaMsg: ChatMessage = {
        id: `santa-${Date.now()}`,
        sender: 'santa',
        text: reply,
        timestamp: Date.now()
      };

      const finalMessages = [...updated, santaMsg];
      setMessages(finalMessages);
      storage.saveChatMessages(finalMessages);
      setIsSantaTyping(false);

      soundManager.playMagicChime();
    }, 1400);
  };

  const handleSpeakMessage = (text: string) => {
    soundManager.speakSanta(text);
  };

  return (
    <div className="max-w-md mx-auto h-[670px] max-h-[82vh] flex flex-col rounded-3xl bg-stone-950/95 border-2 border-stone-800 shadow-2xl text-white overflow-hidden animate-fade-in select-none">
      
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-[#99131d] via-[#750e17] to-[#590910] border-b border-white/20 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm mr-1"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow">
            <img src="/images/santa_avatar.jpg" alt="Santa" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-slab font-bold text-white text-base">
                Santa Claus
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-200 font-slab font-bold">
                North Pole
              </span>
            </div>
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSantaTyping ? 'Santa is typing...' : 'Online from North Pole'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="px-3 py-2 bg-stone-900/90 border-b border-stone-800/80 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Ask Santa:
        </span>
        {SUGGESTED_QUESTIONS.map(q => (
          <button
            key={q.id}
            onClick={() => handleSend(q.text)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 whitespace-nowrap active:scale-95 transition-all"
          >
            {q.text}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-stone-800">
        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <img src="/images/santa_avatar.jpg" alt="Santa" className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                  isMe
                    ? 'bg-red-700 text-white rounded-br-none'
                    : 'bg-stone-800/95 text-stone-100 border border-stone-700 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                
                <div className={`mt-1.5 flex items-center gap-2 text-[10px] ${isMe ? 'text-red-200 justify-end' : 'text-stone-400 justify-between'}`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  {!isMe && (
                    <button
                      onClick={() => handleSpeakMessage(msg.text)}
                      className="flex items-center gap-0.5 text-amber-400 hover:text-amber-300 transition-colors"
                      title="Listen with Santa's voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Santa Typing Indicator */}
        {isSantaTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 shrink-0">
              <img src="/images/santa_avatar.jpg" alt="Santa" className="w-full h-full object-cover" />
            </div>
            <div className="bg-stone-800 border border-stone-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a letter to Santa..."
          className="flex-1 bg-stone-800 text-stone-100 text-xs rounded-full px-4 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 flex items-center justify-center shadow transition-all active:scale-90"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
