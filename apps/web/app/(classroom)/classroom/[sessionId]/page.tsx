
"use client";

import React, { useState, useEffect } from "react";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp,
    MessageSquare, Users, Settings, PenTool, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ClassroomPage({ params }: { params: { sessionId: string } }) {
    const sessionId = params?.sessionId || "unknown";
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [screenShare, setScreenShare] = useState(false);
    const [activeTab, setActiveTab] = useState<"chat" | "participants" | null>(null);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleTab = (tab: "chat" | "participants") => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    const endCall = () => {
        // Navigate back to dashboard using standard browser navigation
        window.location.href = "/dashboard/sessions";
    };

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white">
            {/* Top Bar */}
            <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">T</div>
                    <div>
                        <h1 className="text-sm font-semibold text-white">GCSE Mathematics - Algebra Revision</h1>
                        <p className="text-xs text-slate-400 font-mono">ID: {sessionId}</p>
                    </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 font-mono text-sm text-slate-400">
                    {currentTime}
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Settings className="w-4 h-4" />
                    </Button>
                    <div className="h-4 w-px bg-slate-700 mx-1" />
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                    </div>
                </div>
            </header>

            {/* Main Stage */}
            <main className="flex-1 flex overflow-hidden">

                {/* Central Content (Whiteboard / Videos) */}
                <div className="flex-1 p-4 flex flex-col gap-4 relative">

                    {/* Main View Area */}
                    <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-2xl">

                        {/* Whiteboard Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 to-slate-950">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-slate-700 backdrop-blur-sm">
                                    <PenTool className="w-8 h-8 text-slate-500 " />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-300">Interactive Whiteboard</h2>
                                    <p className="text-slate-500 ">Draw, type, and solve problems together</p>
                                </div>
                                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                    Open Tools
                                </Button>
                            </div>
                        </div>

                        {/* Floating Video: Student (Self) */}
                        <div className="absolute bottom-4 right-4 w-48 aspect-video bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden z-20 group-hover:scale-105 transition-transform duration-300">
                            <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">You</div>
                            {cameraOn ? (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <Users className="w-8 h-8 text-slate-600 " />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                    <VideoOff className="w-6 h-6 text-red-500" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                {!micOn && <div className="p-1 rounded bg-red-500/90 shadow-sm"><MicOff className="w-3 h-3 text-white" /></div>}
                            </div>
                        </div>

                        {/* Floating Video: Tutor */}
                        <div className="absolute top-4 right-4 w-48 aspect-video bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden z-10 group-hover:scale-105 transition-transform duration-300">
                            <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">Dr. Sarah Smith</div>
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                                <img src="https://i.pravatar.cc/150?u=t1" alt="Tutor" className="w-full h-full object-cover opacity-90" />
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <div className="p-1 rounded bg-slate-900/50 backdrop-blur-sm"><Mic className="w-3 h-3 text-white" /></div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Control Bar */}
                    <div className="h-20 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center justify-between px-8 shrink-0 shadow-2xl z-30">
                        <div className="flex items-center gap-4">
                            <Button
                                variant={micOn ? "secondary" : "destructive"}
                                size="icon"
                                aria-label="Toggle Microphone"
                                className={cn("rounded-full w-12 h-12 transition-all duration-200", micOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-red-500 hover:bg-red-600")}
                                onClick={() => setMicOn(!micOn)}
                            >
                                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                            </Button>
                            <Button
                                variant={cameraOn ? "secondary" : "destructive"}
                                size="icon"
                                aria-label="Toggle Camera"
                                className={cn("rounded-full w-12 h-12 transition-all duration-200", cameraOn ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-red-500 hover:bg-red-600")}
                                onClick={() => setCameraOn(!cameraOn)}
                            >
                                {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant={screenShare ? "default" : "outline"}
                                className={cn("h-12 px-6 rounded-full border-slate-700 hover:bg-slate-800 text-slate-300 font-medium", screenShare && "bg-blue-600 border-blue-600 text-white hover:bg-blue-700")}
                                onClick={() => setScreenShare(!screenShare)}
                            >
                                <MonitorUp className="w-5 h-5 mr-2" />
                                {screenShare ? "Stop Sharing" : "Share Screen"}
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
                                size="icon"
                                aria-label="Toggle Chat"
                                className={cn("rounded-full w-12 h-12 transition-colors", activeTab === 'chat' ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-800")}
                                onClick={() => toggleTab('chat')}
                            >
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                            <div className="h-8 w-px bg-slate-700 mx-2" />
                            <Button
                                variant="destructive"
                                className="h-12 px-8 rounded-full font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-900/20"
                                onClick={endCall}
                            >
                                <PhoneOff className="w-5 h-5 mr-2" />
                                End Call
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Chat/Participants) */}
                {activeTab && (
                    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl z-40">
                        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 font-semibold text-slate-200 bg-slate-900/50">
                            <span>{activeTab === 'chat' ? 'Session Chat' : 'Participants'}</span>
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab(null)} className="h-8 w-8 p-0 hover:bg-slate-800 rounded-full">
                                <span className="text-xl leading-none">&times;</span>
                            </Button>
                        </div>

                        {activeTab === 'chat' ? (
                            <>
                                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-900/50">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-xs font-bold text-blue-400">Dr. Sarah Smith</span>
                                            <span className="text-[10px] text-slate-500 ">16:02</span>
                                        </div>
                                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-300 shadow-sm border border-slate-700/50">
                                            Welcome back Alex! Let's start with the quadratic formulas today.
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="text-[10px] text-slate-500 ">16:03</span>
                                            <span className="text-xs font-bold text-emerald-400">You</span>
                                        </div>
                                        <div className="bg-emerald-500/10 text-emerald-100 rounded-2xl rounded-tr-none p-4 text-sm border border-emerald-500/20 shadow-sm">
                                            Sounds good! I had some trouble with the homework.
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-800 bg-slate-900">
                                    <div className="relative flex items-center gap-2">
                                        <Input className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-full pl-4 pr-12 h-11" placeholder="Type a message..." />
                                        <button className="absolute right-1 top-1 h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 space-y-2">
                                {/* Participant List Items */}
                                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-900/20">AR</div>
                                        <div>
                                            <span className="text-sm font-medium text-white block">Alex Rivera</span>
                                            <span className="text-xs text-slate-500 ">Student (You)</span>
                                        </div>
                                    </div>
                                    <Mic className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <img src="https://i.pravatar.cc/150?u=t1" className="w-10 h-10 rounded-full border border-slate-600" />
                                        <div>
                                            <span className="text-sm font-medium text-white block">Dr. Sarah Smith</span>
                                            <span className="text-xs text-blue-400">Tutor (Host)</span>
                                        </div>
                                    </div>
                                    <Mic className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
