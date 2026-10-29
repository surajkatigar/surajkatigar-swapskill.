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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
  }, [partnerParam]);

  // Fetch messages for active partner
  const fetchMessages = async (partnerId: string) => {
    try {
      const res = await api.get(`/chat/messages/${partnerId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner.id);
    }
  }, [activePartner?.id]);

  // Socket listener for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: ChatMessage) => {
      if (
        activePartner &&
        (msg.senderId === activePartner.id || msg.receiverId === activePartner.id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
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
    if (socket) {
      socket.emit('send_direct_message', payload);
    } else {
      // Fallback HTTP
      const res = await api.post('/chat/messages', payload);
      setMessages((prev) => [...prev, res.data]);
    }

    setInputContent('');
    setAttachmentUrl('');
    setFileName('');
    setShowAttachInput(false);
    scrollToBottom();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden h-[82vh] flex">
        {/* Left: Conversations Sidebar */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="text-base font-bold text-slate-900">Direct Messages</h2>
            <p className="text-xs text-slate-500">Coordinate sessions and share study files</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 && !activePartner ? (
              <div className="p-6 text-center text-xs text-slate-400">
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
                      isSelected ? 'bg-indigo-50/80' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={partner.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{partner.name}</span>
                        {c.lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
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
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activePartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  {onlineUserIds.includes(activePartner.id) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activePartner.name}</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">{activePartner.headline}</p>
                </div>
              </div>

              {sessionParam && (
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-700">
                  <Calendar size={13} />
                  <span>Session Linked</span>
                </div>
              )}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {messages.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
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
                        className={`max-w-md rounded-2xl p-3.5 shadow-xs text-xs ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                        {/* File Attachment Pill */}
                        {msg.attachmentUrl && (
                          <div className={`mt-2.5 pt-2 border-t ${isMe ? 'border-indigo-400/50' : 'border-slate-100'}`}>
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center space-x-1.5 p-2 rounded-xl text-[11px] font-semibold ${
                                isMe ? 'bg-indigo-700/80 hover:bg-indigo-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-indigo-600'
                              }`}
                            >
                              <Paperclip size={12} />
                              <span className="truncate max-w-[200px]">{msg.fileName || 'Shared Practice File'}</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 mt-1 px-1">
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
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              {showAttachInput && (
                <div className="mb-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>Attach Practice Exercise or Resource Link</span>
                    <button onClick={() => setShowAttachInput(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="File / Link title (e.g. React-Cheatsheet)"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAttachInput(!showAttachInput)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    showAttachInput ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-slate-200'
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
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim() && !attachmentUrl.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a peer from the left or browse peers to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
