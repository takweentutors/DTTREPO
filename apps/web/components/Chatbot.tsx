import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

const QUICK_REPLIES = [
    'What subjects do you offer?',
    'How much does tuition cost?',
    'How do I book a session?',
    'What levels do you cover?',
    'How do online sessions work?',
];

function getBotResponse(input: string): string {
    const q = input.toLowerCase();

    if (q.includes('subject')) {
        return '📚 We offer tuition in Maths, English, Science, History, Geography, Computer Science, Business Studies, Economics, Psychology, Sociology, Politics, and more — across GCSE, A-Level, BTEC, and 11+ levels!';
    }
    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
        return '💰 Our pricing depends on the tuition type and level:\n\n• **Platinum Path (1:1)** — from £15/session\n• **Gold Edge (2:1)** — from £19/session\n• **Bronze Boost (5:1)** — from £8/session\n\nVisit our /pricing page for full details!';
    }
    if (q.includes('book') || q.includes('session') || q.includes('sign up')) {
        return '📅 Booking is easy!\n\n1. Browse our subjects at /subjects\n2. Pick your subject and click "Book Now"\n3. Choose your tuition type, date & time\n4. Complete payment via Stripe\n\nYou\'ll be matched with a verified tutor!';
    }
    if (q.includes('level') || q.includes('gcse') || q.includes('a-level') || q.includes('11+') || q.includes('btec')) {
        return '🎓 We cover 4 academic levels:\n\n• **11+** — Entrance exam preparation\n• **GCSE** — Years 10-11\n• **A-Level** — Years 12-13\n• **BTEC** — Vocational qualifications\n\nEach level has tailored pricing and tutors!';
    }
    if (q.includes('online') || q.includes('how do') || q.includes('work') || q.includes('zoom')) {
        return '💻 Sessions run online via Zoom!\n\nAfter booking, you\'ll receive a link to join. Our tutors use whiteboards and screen-sharing to make learning interactive. Sessions are recorded so you can revisit them later.';
    }
    if (q.includes('tutor') || q.includes('teacher') || q.includes('who')) {
        return '👩‍🏫 All our tutors are DBS-checked, verified professionals with proven track records. Many are university graduates or current postgrad students specialising in their subjects.';
    }
    if (q.includes('cancel') || q.includes('refund')) {
        return '🔄 You can cancel a session up to 24 hours in advance for a full refund. Please see our Terms of Service for full details.';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hey there! 👋 I'm the Let's Go Tutors assistant. How can I help you today? Feel free to ask about our subjects, pricing, or how to book!";
    }
    if (q.includes('thank')) {
        return 'You\'re welcome! 😊 Is there anything else I can help with?';
    }

    return '🤔 I\'m not sure about that one! Here are some things I can help with:\n\n• Subjects we offer\n• Pricing information\n• How to book a session\n• Academic levels we cover\n\nOr feel free to email us at **hello@letsgotutors.com**!';
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Hey! 👋 I'm the Let's Go Tutors assistant. Ask me anything about our subjects, pricing, or how to book!", sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), text, sender: 'user' };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // Simulate bot typing delay
        setTimeout(() => {
            const botMsg: Message = { id: Date.now() + 1, text: getBotResponse(text), sender: 'bot' };
            setMessages((prev) => [...prev, botMsg]);
        }, 400);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl"
                style={{ background: '#00D4FF' }}
                aria-label="Open chat"
            >
                {open ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
                    style={{ height: '480px' }}
                >
                    {/* Header */}
                    <div
                        className="px-5 py-4 text-white flex items-center gap-3 shrink-0"
                        style={{ background: '#00D4FF' }}
                    >
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">LGT Assistant</h3>
                            <p className="text-xs text-white/70">Ask me anything!</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-md'
                                        : 'bg-slate-100 text-slate-700 rounded-bl-md'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 2 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {QUICK_REPLIES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 flex gap-2 shrink-0">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105"
                            style={{ background: '#00D4FF' }}
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
