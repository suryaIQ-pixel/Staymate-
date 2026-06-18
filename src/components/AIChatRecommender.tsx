/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, ArrowRight, Home, IndianRupee, Compass } from 'lucide-react';
import { ChatMessage, Property } from '../types';

interface AIChatRecommenderProps {
  currentUserEmail: string;
  onSelectProperty: (prop: Property) => void;
  properties: Property[];
}

export default function AIChatRecommender({ currentUserEmail, onSelectProperty, properties }: AIChatRecommenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'AI',
      receiver: currentUserEmail,
      message: "👋 Namaste! I am StayMate's AI Companion. Ask me to find standard stay options like: 'PGs in Bangalore under 10k with food' or 'Stays near Hansraj college Boys'!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle preset suggestions clicks
  const handlePresetClick = (presetText: string) => {
    setInputVal(presetText);
    sendMessage(presetText);
  };

  const sendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || inputVal;
    if (!finalMsg.trim()) return;

    if (!textToSend) setInputVal('');

    // Append user message local State
    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      sender: currentUserEmail,
      receiver: 'AI',
      message: finalMsg,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUserEmail,
          receiver: 'AI',
          message: finalMsg
        })
      });

      if (response.ok) {
        // Since backend already appends messages to databases, let's load entire dialogs or wait for responses
        // Let's fetch active chat log
        const logRes = await fetch(`/api/chats?user=${currentUserEmail}`);
        const logData: ChatMessage[] = await logRes.json();
        
        // Match only dialogs where user is involved
        if (logData.length > 0) {
          setMessages(logData);
        }
      }
    } catch (err) {
      console.error('Error fetching chat session response:', err);
      // Fallback
      setMessages(prev => [...prev, {
        id: `chat-fall-${Date.now()}`,
        sender: 'AI',
        receiver: currentUserEmail,
        message: `Hi there! I faced a temporary connection blip. However, noting your interest in "${finalMsg}", I highly recommend sorting by budget or city in our main menu!`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Find properties mentioned in message response to render clickable cards
  const getInlineAccommodations = (messageText: string) => {
    return properties.filter(p => {
      // Clean string includes
      const cleanName = p.name.toLowerCase();
      const cleanMsg = messageText.toLowerCase();
      return cleanMsg.includes(cleanName) || cleanMsg.includes(p.id.toLowerCase()) || (cleanMsg.includes(p.city.toLowerCase()) && cleanMsg.includes(p.area.toLowerCase()));
    }).slice(0, 2);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          id="btn-trigger-ai"
          onClick={() => setIsOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 select-none ring-4 ring-brand-100 dark:ring-offset-slate-900 group"
          title="Ask StayMate AI"
        >
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-350 animate-bounce" id="ai-active-pulse" />
          <span className="text-xs font-bold font-display uppercase tracking-wider hidden sm:inline group-hover:pr-1">Ask AI Assistant</span>
        </button>
      )}

      {/* --- CHAT DIALOG PANEL OVERLAY --- */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md h-[480px] flex flex-col card-shadow overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header bar */}
          <div className="p-4 bg-gradient-to-r from-brand-600 to-indigo-850 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-white/10 p-2 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              </div>
              <div className="text-left">
                <h4 className="font-display font-semibold text-sm leading-tight flex items-center gap-1">StayMate Smart AI <span className="text-[9px] bg-emerald-500 text-white font-sans px-1 py-0.25 rounded-md uppercase font-extrabold tracking-widest leading-none">Flash</span></h4>
                <span className="text-[10px] text-slate-200 block">Answers PG lists, locations & refund queries</span>
              </div>
            </div>
            <button 
              id="close-ai-dialog"
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-full hover:bg-white/15 text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950">
            {messages.map(msg => {
              const isUsr = msg.sender === currentUserEmail;
              const matchingStays = !isUsr ? getInlineAccommodations(msg.message) : [];
              
              return (
                <div key={msg.id} className={`flex flex-col ${isUsr ? 'items-end' : 'items-start'} space-y-1.5`}>
                  
                  {/* Bubble body */}
                  <div className={`p-3 max-w-[85%] rounded-2xl text-left text-xs ${
                    isUsr 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-700 dark:text-slate-200 rounded-tl-none card-shadow'
                  }`}>
                    {/* Preserve line breaks for clean list formats */}
                    <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                    <span className={`text-[8px] mt-1 text-right block ${isUsr ? 'text-brand-100' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Render Matching Properties inline if detected in response */}
                  {matchingStays.length > 0 && (
                    <div className="w-full max-w-[85%] space-y-2 mt-1 pl-2 border-l-2 border-brand-500">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">AI Recommended match:</span>
                      {matchingStays.map(stay => (
                        <div 
                          key={`inline-${stay.id}`}
                          onClick={() => { onSelectProperty(stay); setIsOpen(false); }}
                          className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-750 p-2 rounded-xl flex gap-2.5 cursor-pointer hover:border-brand-300 dark:hover:border-slate-600 transition-all card-shadow text-left"
                        >
                          <img src={stay.images[0]} alt={stay.name} className="w-10 h-10 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                          <div className="truncate flex-grow">
                            <span className="font-semibold text-[11px] text-slate-800 dark:text-white block truncate">{stay.name}</span>
                            <span className="text-[9px] text-slate-400 block">{stay.area}, {stay.city}</span>
                            <strong className="text-[10px] text-brand-600 dark:text-brand-400 block mt-0.5">₹{stay.price.toLocaleString()}/mo</strong>
                          </div>
                          <div className="place-self-center shrink-0 p-1 rounded-full bg-slate-50 dark:bg-slate-800">
                            <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-1.5 text-slate-400 dark:text-slate-500 text-xs text-left">
                <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
                <span className="font-medium animate-pulse-slow font-mono">StayMate AI is reading stay catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Chips Quick Actions */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-100/50 dark:bg-slate-900/50 scrollbar-none shrink-0 select-none">
            <button 
              onClick={() => handlePresetClick('Single private room in Bangalore')}
              className="text-[9px] font-bold py-1 px-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-100 cursor-pointer"
            >
              Single Bangalore 
            </button>
            <button 
              onClick={() => handlePresetClick('PG near Delhi North College')}
              className="text-[9px] font-bold py-1 px-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-100 cursor-pointer"
            >
              Delhi Campus PG
            </button>
            <button 
              onClick={() => handlePresetClick('Girls Hostels in Powai Mumbai')}
              className="text-[9px] font-bold py-1 px-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-100 cursor-pointer"
            >
              Powai Girls Stay
            </button>
          </div>

          {/* Send Input Bar bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-250 dark:border-slate-800 shrink-0">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type budget, sharing preference..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-grow text-xs border rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button 
                id="btn-send-ai-chat"
                onClick={() => sendMessage()}
                className="bg-brand-600 hover:bg-brand-700 text-white p-2 text-xs rounded-xl flex items-center justify-center cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
