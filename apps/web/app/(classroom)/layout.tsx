
import React from "react";

export const metadata = {
 title: "Let's Go Tutors Live Classroom",
 description: "Virtual Classroom Environment",
};

export default function ClassroomLayout({
 children,
}: {
 children?: React.ReactNode;
}) {
 return (
 <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
 {children}
 </div>
 );
}
