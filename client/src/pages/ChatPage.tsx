import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  CheckCheck,
  Circle,
  X,
  Video,
} from 'lucide-react';
import api from '../services/api';
import { ChatMessage, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { socket, onlineUserIds } = useSocket();
  const [searchParams] = useSearchParams();

  const partnerParam = searchParams.get('partner');
  const sessionParam = searchParams.get('session');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [showAttachInput, setShowAttachInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reliable scroll-to-bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }
  };

  // Automatically scroll to bottom whenever messages list or typing state changes
  useEffect(() => {
    scrollToBottom('smooth');
    const timer = setTimeout(() => scrollToBottom('smooth'), 50);
    return () => clearTimeout(timer);
  }, [messages.length, activePartner?.id, isTyping]);

  // Fetch active conversations
  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data);

      if (partnerParam) {
        const found = res.data.find((c: any) => c.partner.id === partnerParam);
        if (found) {
          setActivePartner(found.partner);
        } else {
          // Fetch user details directly if starting a fresh thread
          const userRes = await api.get(`/users/${partnerParam}`);
          setActivePartner(userRes.data);
        }
      } else if (res.data.length > 0 && !activePartner) {
        setActivePartner(res.data[0].partner);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [partnerParam, user?.id]);

  // Fetch messages for active partner
  const fetchMessages = async (partnerId: string) => {
    try {
      const res = await api.get(`/chat/messages/${partnerId}`);
      setMessages(res.data);
      // Instant scroll on load
      setTimeout(() => scrollToBottom('auto'), 40);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner.id);
    }
  }, [activePartner?.id]);

  // Socket listener for real-time messages with deduplication
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: ChatMessage) => {
      if (
        activePartner &&
        (msg.senderId === activePartner.id || msg.receiverId === activePartner.id)
      ) {
        setMessages((prev) => {
          // Avoid duplicate renders if the message already exists in state
          if (prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [...prev, msg];
        });
      }
      fetchConversations();
    };

    const handleTyping = ({ userId }: { userId: string }) => {
      if (activePartner?.id === userId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (activePartner?.id === userId) {
        setIsTyping(false);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [socket, activePartner?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() && !attachmentUrl.trim()) return;
    if (!activePartner || !user) return;

    const payload = {
      senderId: user.id,
      receiverId: activePartner.id,
      sessionId: sessionParam || undefined,
      content: inputContent.trim(),
      attachmentUrl: attachmentUrl.trim() || undefined,
      fileName: fileName.trim() || undefined,
    };

    // If socket is connected, emit real-time
    if (socket && socket.connected) {
      socket.emit('send_direct_message', payload);
    } else {
      // Fallback HTTP
      try {
        const res = await api.post('/chat/messages', payload);
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.data.id)) return prev;
          return [...prev, res.data];
        });
      } catch (err) {
        console.error('Failed to send fallback HTTP message:', err);
      }
    }

    setInputContent('');
    setAttachmentUrl('');
    setFileName('');
    setShowAttachInput(false);
  };

  const handleStartGoogleMeet = () => {
    if (!activePartner || !user) return;
    window.open('https://meet.google.com/new', '_blank');

    const promptText = prompt(
      `Google Meet has been opened in a new tab!\n\nOnce your room is open, paste your meeting link here to send it to ${activePartner.name} (or leave as default):`,
      'https://meet.google.com/new'
    );

    if (promptText && promptText.trim()) {
      const meetLink = promptText.trim();
      const payload = {
        senderId: user.id,
        receiverId: activePartner.id,
        sessionId: sessionParam || undefined,
        content: `📹 Let's jump on Google Meet: ${meetLink}`,
      };

      if (socket && socket.connected) {
        socket.emit('send_direct_message', payload);
      } else {
        api
          .post('/chat/messages', payload)
          .then((res) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          })
          .catch(() => {});
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      <div className="bg-[#0d0d14]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden h-[82vh] flex">
        {/* Left: Conversations Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-white/[0.02] shrink-0">
          <div className="p-4 border-b border-white/10 bg-[#0d0d14]/90">
            <h2 className="text-base font-bold text-white">Direct Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">Coordinate sessions and share study files</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {conversations.length === 0 && !activePartner ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active conversations yet. Visit Explore or Matches to start a chat!
              </div>
            ) : (
              conversations.map((c: any) => {
                const partner = c.partner;
                const isOnline = onlineUserIds.includes(partner.id);
                const isSelected = activePartner?.id === partner.id;

                return (
                  <button
                    key={partner.id}
                    onClick={() => setActivePartner(partner)}
                    className={`w-full p-3.5 text-left flex items-start space-x-3 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 border-l-2 border-indigo-500 text-white'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={partner.name}
                        className="w-11 h-11 rounded-xl object-cover border border-white/15"
                      />
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0d0d14]"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{partner.name}</span>
                        {c.lastMessage && (
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.lastMessage?.content || 'Started conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        {activePartner ? (
          <div className="flex-1 flex flex-col bg-transparent">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0d0d14]/90 z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activePartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/15"
                  />
                  {onlineUserIds.includes(activePartner.id) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0d0d14]"></span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activePartner.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">{activePartner.headline}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleStartGoogleMeet}
                  title="Start Google Meet video room"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-100"
                >
                  <Video size={13} className="text-emerald-400" />
                  <span>Google Meet</span>
                </button>

                {sessionParam && (
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300">
                    <Calendar size={13} />
                    <span>Session Linked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Stream with Ref attached */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black/20 scroll-smooth">
              {messages.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500">
                  No messages exchanged yet. Say hello and introduce what you'd like to learn!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-3.5 shadow-md text-xs ${
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-xs shadow-indigo-600/25'
                            : 'bg-white/[0.08] border border-white/10 text-slate-100 rounded-bl-xs'
                        }`}
                      >
                        {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                        {/* File Attachment Pill */}
                        {msg.attachmentUrl && (
                          <div className={`mt-2.5 pt-2 border-t ${isMe ? 'border-white/20' : 'border-white/10'}`}>
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center space-x-1.5 p-2 rounded-xl text-[11px] font-semibold transition-colors ${
                                isMe
                                  ? 'bg-indigo-700/80 hover:bg-indigo-700 text-white'
                                  : 'bg-white/10 hover:bg-white/20 text-indigo-300'
                              }`}
                            >
                              <Paperclip size={12} />
                              <span className="truncate max-w-[200px]">{msg.fileName || 'Shared Practice File'}</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              {isTyping && (
                <div className="text-xs text-slate-400 italic flex items-center space-x-1">
                  <span>{activePartner.name} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0d0d14]/90">
              {showAttachInput && (
                <div className="mb-2.5 p-3 bg-white/[0.04] border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span>Attach Practice Exercise or Resource Link</span>
                    <button onClick={() => setShowAttachInput(false)} className="text-slate-400 hover:text-white p-0.5">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="File / Link title (e.g. React-Cheatsheet)"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="px-2.5 py-1.5 text-xs border border-white/10 rounded-lg bg-white/[0.06] text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="px-2.5 py-1.5 text-xs border border-white/10 rounded-lg bg-white/[0.06] text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAttachInput(!showAttachInput)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    showAttachInput
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                  title="Share practice file or link"
                >
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Message ${activePartner.name}...`}
                  className="flex-1 px-4 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim() && !attachmentUrl.trim()}
                  className="p-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-105 active:scale-100 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Select a peer from the left or browse peers to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
