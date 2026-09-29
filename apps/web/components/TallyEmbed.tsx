import React, { useEffect, useRef } from 'react';

interface TallyEmbedProps {
 formId?: string;
 title?: string;
}

/**
 * React-safe Tally form embed.
 * Loads the Tally embed script once and renders an iframe.
 * Falls back to setting iframe src directly if Tally script is unavailable.
 */
export default function TallyEmbed({
 formId = "GxK8LQ",
 title = "Let's Go Tutors — Tutor Application Tally Form",
}: TallyEmbedProps) {
 const iframeRef = useRef<HTMLIFrameElement>(null);
 const scriptLoadedRef = useRef(false);

 const src = `https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

 useEffect(() => {
 // Avoid duplicate script injection
 if (scriptLoadedRef.current) return;

 const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
 if (existingScript) {
 scriptLoadedRef.current = true;
 // If Tally is already available, load embeds
 if ((window as any).Tally) {
 (window as any).Tally.loadEmbeds();
 }
 return;
 }

 const script = document.createElement('script');
 script.src = 'https://tally.so/widgets/embed.js';
 script.async = true;
 script.onload = () => {
 scriptLoadedRef.current = true;
 if ((window as any).Tally) {
 (window as any).Tally.loadEmbeds();
 }
 };
 script.onerror = () => {
 // Fallback: set iframe src directly
 if (iframeRef.current) {
 iframeRef.current.src = src;
 }
 };
 document.head.appendChild(script);

 return () => {
 // Don't remove script on unmount — it should persist across route changes
 };
 }, [src]);

 return (
 <iframe
 ref={iframeRef}
 data-tally-src={src}
 width="100%"
 height="500"
 frameBorder={0}
 marginHeight={0}
 marginWidth={0}
 title={title}
 style={{ border: 'none', minHeight: '500px' }}
 />
 );
}
