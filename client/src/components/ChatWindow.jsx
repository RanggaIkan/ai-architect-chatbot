import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import MaterialCard from './MaterialCard';

const QUICK_SUGGESTIONS = [
  "Analyze 14m cantilever deflection under cyclone loads",
  "Recommend low-carbon facade materials for coastal cliffs",
  "Design passive geothermal cooling for high-altitude villas",
  "Specify acoustic and thermal glass for luxury sky penthouses"
];

export const ChatWindow = ({ initialPrompt = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      content: 'Welcome to the AETHEL AI Structural Studio. I am your Principal Architectural & Structural Engineering Consultant. Inquire about radical cantilever mechanics, structural feasibility, seismic mitigation, or curated luxury material palettes for your bespoke project.',
      materials: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const executeSend = async (messageText) => {
    const trimmedInput = (messageText || input).trim();
    if (!trimmedInput || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      content: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(trimmedInput);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: data.message || 'Consultation complete.',
        materials: Array.isArray(data.suggestedMaterials) ? data.suggestedMaterials : [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to receive architectural consultation.');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          content: 'I encountered a disruption while analyzing the structural parameters. Please verify your connection or API key and try again.',
          materials: [],
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        content: 'Structural session cleared. How can I assist your architectural engineering today?',
        materials: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="flex h-[800px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-stone-300/80 bg-white shadow-2xl shadow-stone-300/40 backdrop-blur-2xl">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-md">
            <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm md:text-base font-extrabold tracking-tight text-stone-900 flex items-center gap-2 font-serif-luxury">
              <span>Studio AI Principal Architect</span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-900 border border-amber-300 uppercase">
                LLaMA-3.1
              </span>
            </h2>
            <p className="text-[11px] font-medium text-stone-500 font-mono">
              Structural Physics & Bespoke Material Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleClear}
            title="Reset Studio Consultation"
            className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors shadow-2xs"
          >
            Clear Session
          </button>
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Groq Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin bg-stone-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="mb-1.5 flex items-center space-x-2 px-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                {msg.sender === 'user' ? 'Client / Project Principal' : 'Lead Architect & Engineer'}
              </span>
              <span className="text-[10px] font-mono text-stone-400">{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-3xl rounded-3xl p-5 text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white font-normal'
                  : msg.isError
                  ? 'border border-rose-300 bg-rose-50 text-rose-800'
                  : 'border border-stone-200 bg-white text-stone-800'
              }`}
            >
              <p className="whitespace-pre-wrap font-light">{msg.content}</p>

              {/* Dynamic Suggested Materials Component */}
              {msg.materials && msg.materials.length > 0 && (
                <div className="mt-6 border-t border-stone-200 pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800">
                      Curated Engineering Materials ({msg.materials.length})
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">Physics & Durability Specs</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {msg.materials.map((mat, idx) => (
                      <MaterialCard key={`${msg.id}-mat-${idx}`} material={mat} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="mb-1.5 flex items-center space-x-2 px-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                Lead Architect & Engineer
              </span>
            </div>
            <div className="flex items-center space-x-3 rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm text-stone-600 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-600" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-600 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-600 [animation-delay:0.4s]" />
              </div>
              <span className="font-mono text-xs tracking-wide text-stone-700">
                Computing structural physics & curating material specifications...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion Chips */}
      <div className="border-t border-stone-200 bg-stone-100/80 px-6 py-2.5 overflow-x-auto scrollbar-none flex items-center space-x-2">
        <span className="text-[10px] font-mono uppercase text-stone-500 font-bold whitespace-nowrap">Suggested:</span>
        {QUICK_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => executeSend(sug)}
            disabled={isLoading}
            className="whitespace-nowrap rounded-lg border border-stone-300 bg-white px-3 py-1 text-[11px] font-mono text-stone-700 hover:border-amber-600 hover:text-amber-800 transition-colors disabled:opacity-50 shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <footer className="border-t border-stone-200 bg-white p-5">
        {error && (
          <div className="mb-2 text-xs font-mono text-rose-600">
            {error}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); executeSend(); }} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., Design a cantilevered infinity pavilion overlooking the coast. What materials should we specify?"
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-stone-300 bg-stone-50 px-5 py-3.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 disabled:opacity-50 font-light"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center space-x-2 rounded-2xl bg-stone-900 px-7 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-md shadow-stone-900/20 transition-all hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Consult</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;
