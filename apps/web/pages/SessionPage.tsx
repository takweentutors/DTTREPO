import React, { useState, lazy, Suspense } from 'react';
import { Video, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import '@excalidraw/excalidraw/index.css';

// Lazy-load Excalidraw (it's a large bundle)
const Excalidraw = lazy(() =>
 import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw }))
);

interface SessionPageProps {
 sessionId: string;
}

export default function SessionPage({ sessionId }: SessionPageProps) {
 const roomName = `lgt-${sessionId}`;
 const [videoPanelCollapsed, setVideoPanelCollapsed] = useState(false);

 const jitsiSrc = `https://meet.jit.si/${encodeURIComponent(roomName)}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT=false&interfaceConfig.SHOW_JITSI_WATERMARK=false`;

 return (
 <>
 {/* Scoped responsive CSS */}
 <style>{`
 .session-panels {
 display: flex;
 flex-direction: column;
 flex: 1;
 min-height: 0;
 overflow: hidden;
 }
 .session-video {
 min-height: 280px;
 display: flex;
 flex-direction: column;
 }
 .session-whiteboard {
 min-height: 400px;
 flex: 1;
 display: flex;
 flex-direction: column;
 overflow: hidden;
 }
 .excalidraw-host {
 flex: 1;
 position: relative;
 }
 .excalidraw-host > div {
 position: absolute;
 inset: 0;
 }
 @media (min-width: 1024px) {
 .session-panels {
 flex-direction: row;
 }
 .session-video {
 width: ${videoPanelCollapsed ? '0' : '35%'};
 min-height: 0;
 ${videoPanelCollapsed ? 'display: none;' : ''}
 }
 .session-whiteboard {
 width: ${videoPanelCollapsed ? '100%' : '65%'};
 min-height: 0;
 }
 }
 `}</style>

 <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
 {/* ── Top Bar ── */}
 <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
 <div className="flex items-center gap-3">
 <button
 onClick={() => window.history.back()}
 className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
 >
 <ArrowLeft className="w-4 h-4 text-slate-600 " />
 </button>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="font-semibold text-slate-900 text-sm">Live Lesson</span>
 </div>
 <span className="text-xs text-slate-400 font-mono hidden sm:block">
 Session: {sessionId.slice(0, 8)}…
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setVideoPanelCollapsed(!videoPanelCollapsed)}
 className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
 title={videoPanelCollapsed ? 'Expand video' : 'Collapse video'}
 >
 {videoPanelCollapsed ? (
 <Maximize2 className="w-4 h-4 text-slate-600 " />
 ) : (
 <Minimize2 className="w-4 h-4 text-slate-600 " />
 )}
 </button>
 <button
 onClick={() => window.history.back()}
 className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
 >
 Leave
 </button>
 </div>
 </header>

 {/* ── Main Content: Video + Whiteboard ── */}
 <div className="session-panels">
 {/* LEFT PANEL — Jitsi Video + Chat */}
 <div className="session-video border-r border-slate-200 bg-slate-900">
 <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
 <Video className="w-4 h-4 text-emerald-400" />
 <span className="text-xs font-medium text-slate-300">Video & Chat</span>
 </div>
 <div className="flex-1 relative">
 <iframe
 src={jitsiSrc}
 allow="camera; microphone; fullscreen; display-capture"
 className="absolute inset-0 w-full h-full border-0"
 title="Video call"
 />
 </div>
 </div>

 {/* RIGHT PANEL — Excalidraw Whiteboard */}
 <div className="session-whiteboard bg-white ">
 <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-slate-200 shrink-0">
 <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M12 19l7-7 3 3-7 7-3-3z" />
 <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
 <path d="M2 2l7.586 7.586" />
 <circle cx="11" cy="11" r="2" />
 </svg>
 <span className="text-xs font-medium text-slate-600 ">Whiteboard</span>
 </div>
 <div className="excalidraw-host">
 <Suspense
 fallback={
 <div className="absolute inset-0 flex items-center justify-center bg-white ">
 <div className="flex flex-col items-center gap-3">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
 <span className="text-sm text-slate-500 ">Loading whiteboard…</span>
 </div>
 </div>
 }
 >
 <div style={{ width: '100%', height: '100%' }}>
 <Excalidraw theme="light" />
 </div>
 </Suspense>
 </div>
 </div>
 </div>
 </div>
 </>
 );
}
