
import { User, Session, Resource, Tutor, Contact, Message, Transaction } from "./types";

// Simulated Logged In User
export const currentUser: User = {
 id: "u1",
 firstName: "Alex",
 lastName: "Rivera",
 email: "alex.rivera@student.letsgotutors.com",
 role: "student",
 balanceHours: 12.5,
};

// Mock Data: Upcoming Sessions
export const upcomingSessions: Session[] = [
 {
 id: "s1",
 studentId: "u1",
 tutorId: "t1",
 tutorName: "Dr. Rasha Aziz",
 subject: "GCSE Mathematics",
 date: "2023-11-15",
 startTime: "16:00",
 endTime: "17:00",
 status: "upcoming",
 meetingLink: "/classroom/s1",
 },
 {
 id: "s2",
 studentId: "u1",
 tutorId: "t2",
 tutorName: "James Wilson",
 subject: "A-Level Physics",
 date: "2023-11-17",
 startTime: "15:30",
 endTime: "16:30",
 status: "upcoming",
 meetingLink: "/classroom/s2",
 },
 {
 id: "s3",
 studentId: "u1",
 tutorId: "t1",
 tutorName: "Dr. Rasha Aziz",
 subject: "GCSE Mathematics",
 date: "2023-11-22",
 startTime: "16:00",
 endTime: "17:00",
 status: "upcoming",
 },
];

// Mock Data: Past Sessions
export const pastSessions: Session[] = [
 {
 id: "s-old-1",
 studentId: "u1",
 tutorId: "t3",
 tutorName: "Emily Chen",
 subject: "GCSE Biology",
 date: "2023-10-28",
 startTime: "14:00",
 endTime: "15:00",
 status: "completed",
 },
 {
 id: "s-old-2",
 studentId: "u1",
 tutorId: "t1",
 tutorName: "Dr. Rasha Aziz",
 subject: "GCSE Mathematics",
 date: "2023-10-25",
 startTime: "16:00",
 endTime: "17:00",
 status: "completed",
 }
];

// Mock Data: Resources
export const allResources: Resource[] = [
 {
 id: "r1",
 title: "Algebra II - Revision Notes",
 subject: "Maths",
 type: "pdf",
 url: "#",
 dateAdded: "2023-11-10",
 },
 {
 id: "r2",
 title: "Photosynthesis Explained",
 subject: "Biology",
 type: "video",
 url: "#",
 dateAdded: "2023-11-08",
 },
 {
 id: "r3",
 title: "Macbeth Character Analysis",
 subject: "English Lit",
 type: "link",
 url: "#",
 dateAdded: "2023-11-05",
 },
 {
 id: "r4",
 title: "Newton's Laws of Motion",
 subject: "Physics",
 type: "pdf",
 url: "#",
 dateAdded: "2023-10-20",
 },
 {
 id: "r5",
 title: "Organic Chemistry Basics",
 subject: "Chemistry",
 type: "video",
 url: "#",
 dateAdded: "2023-10-15",
 },
 {
 id: "r6",
 title: "GCSE Spanish Vocabulary List",
 subject: "Spanish",
 type: "pdf",
 url: "#",
 dateAdded: "2023-09-30",
 },
 {
 id: "r7",
 title: "Calculus: Derivatives",
 subject: "Maths",
 type: "video",
 url: "#",
 dateAdded: "2023-11-12",
 },
];

// Export recent resources for dashboard
export const recentResources = allResources.slice(0, 3);

// Mock Data: Available Tutors
export const availableTutors: Tutor[] = [
 {
 id: "t1",
 name: "Dr. Rasha Aziz",
 subjects: ["GCSE Mathematics", "A-Level Mathematics", "Statistics"],
 bio: "PhD in Mathematics. With over 15 years of teaching experience, I specialise in helping students build confidence and master exam techniques for GCSE and A-Level success.",
 rating: 5.0,
 hourlyRate: 45,
 imageUrl: "https://i.pravatar.cc/150?u=t1",
 reviews: [
 { id: "rv1", authorName: "John D.", rating: 5, comment: "Dr. Rasha is amazing! She explained calculus in a way I finally understood.", date: "2023-10-15" },
 { id: "rv2", authorName: "Emma W.", rating: 5, comment: "Great session, very prepared.", date: "2023-09-20" }
 ]
 },
 {
 id: "t2",
 name: "James Wilson",
 subjects: ["A-Level Physics", "GCSE Physics", "GCSE Science"],
 bio: "Former engineer turned educator. I make complex physics concepts easy to visualize and understand using real-world examples.",
 rating: 4.8,
 hourlyRate: 35,
 imageUrl: "https://i.pravatar.cc/150?u=t2",
 reviews: [
 { id: "rv3", authorName: "Liam K.", rating: 5, comment: "Physics isn't scary anymore thanks to James.", date: "2023-11-01" }
 ]
 },
 {
 id: "t3",
 name: "Emily Chen",
 subjects: ["GCSE Biology", "A-Level Biology", "Chemistry"],
 bio: "Medical student with a passion for biology. I help students master the syllabus and prepare for medical school applications.",
 rating: 5.0,
 hourlyRate: 30,
 imageUrl: "https://i.pravatar.cc/150?u=t3"
 },
 {
 id: "t4",
 name: "Marcus Johnson",
 subjects: ["English Literature", "English Language", "History"],
 bio: "Published author and experienced tutor. Specializing in essay writing skills and critical analysis.",
 rating: 4.7,
 hourlyRate: 30,
 imageUrl: "https://i.pravatar.cc/150?u=t4"
 },
 {
 id: "t5",
 name: "Sofia Rodriguez",
 subjects: ["Spanish", "French"],
 bio: "Native speaker and certified linguist. My immersive teaching style helps students gain fluency and confidence fast.",
 rating: 4.9,
 hourlyRate: 25,
 imageUrl: "https://i.pravatar.cc/150?u=t5"
 }
];

// Mock Data: Messaging
export const contacts: Contact[] = [
 {
 id: "t1",
 name: "Dr. Rasha Aziz",
 role: "Tutor",
 avatarUrl: "https://i.pravatar.cc/150?u=t1",
 lastMessage: "Please remember to bring your calculator for tomorrow's session.",
 lastMessageTime: "10:30 AM",
 unreadCount: 1,
 online: true,
 },
 {
 id: "t2",
 name: "James Wilson",
 role: "Tutor",
 avatarUrl: "https://i.pravatar.cc/150?u=t2",
 lastMessage: "Great progress today! See you next week.",
 lastMessageTime: "Yesterday",
 unreadCount: 0,
 online: false,
 },
 {
 id: "admin",
 name: "LGT Support",
 role: "Support",
 avatarUrl: "", 
 lastMessage: "Your payment has been processed successfully.",
 lastMessageTime: "Nov 10",
 unreadCount: 0,
 online: true,
 },
];

export const mockChatHistory: Record<string, Message[]> = {
 "t1": [
 { id: "m1", senderId: "t1", text: "Hi Alex, are you ready for our upcoming session on Algebra?", timestamp: "10:00 AM", isMe: false },
 { id: "m2", senderId: "u1", text: "Hi Dr. Rasha! Yes, I've been reviewing the notes you sent.", timestamp: "10:15 AM", isMe: true },
 { id: "m3", senderId: "t1", text: "Excellent. Please remember to bring your calculator for tomorrow's session.", timestamp: "10:30 AM", isMe: false },
 ],
 "t2": [
 { id: "m1", senderId: "u1", text: "Hi James, I had a question about the physics homework.", timestamp: "Yesterday 4:00 PM", isMe: true },
 { id: "m2", senderId: "t2", text: "Sure, what are you stuck on?", timestamp: "Yesterday 4:05 PM", isMe: false },
 { id: "m3", senderId: "u1", text: "Question 5 regarding velocity.", timestamp: "Yesterday 4:10 PM", isMe: true },
 { id: "m4", senderId: "t2", text: "Great progress today! See you next week.", timestamp: "Yesterday 5:00 PM", isMe: false },
 ],
 "admin": [
 { id: "m1", senderId: "admin", text: "Welcome to Let's Go Tutors!", timestamp: "Nov 01", isMe: false },
 { id: "m2", senderId: "admin", text: "Your payment has been processed successfully.", timestamp: "Nov 10", isMe: false },
 ]
};

// Mock Data: My Students (For Tutor View)
export interface StudentSummary {
 id: string;
 name: string;
 gradeLevel: string;
 subject: string;
 nextSession: string;
 lastSession: string;
 progress: number; // 0-100
 status: 'active' | 'paused';
}

export const myStudents: StudentSummary[] = [
 {
 id: "s1",
 name: "Alex Rivera",
 gradeLevel: "Year 11",
 subject: "GCSE Maths",
 nextSession: "Tomorrow, 16:00",
 lastSession: "Nov 10",
 progress: 75,
 status: "active"
 },
 {
 id: "s2",
 name: "Sarah Jones",
 gradeLevel: "Year 13",
 subject: "A-Level Further Maths",
 nextSession: "Nov 20, 14:00",
 lastSession: "Nov 12",
 progress: 88,
 status: "active"
 },
 {
 id: "s3",
 name: "Michael Chen",
 gradeLevel: "Year 10",
 subject: "GCSE Maths",
 nextSession: "Unscheduled",
 lastSession: "Oct 30",
 progress: 60,
 status: "paused"
 }
];

// Mock Data: Transactions
export const transactions: Transaction[] = [
 { id: "tx1", type: "payment", description: "Session with Dr. Rasha Aziz", amount: 45, credits: 1, date: "2023-11-14", status: "completed" },
 { id: "tx2", type: "deposit", description: "Platinum Package Top-up", amount: 450, credits: 10, date: "2023-11-01", status: "completed", invoiceUrl: "#" },
 { id: "tx3", type: "payment", description: "Session with James Wilson", amount: 35, credits: 1, date: "2023-10-28", status: "completed" },
 { id: "tx4", type: "payment", description: "Session with Dr. Rasha Aziz", amount: 45, credits: 1, date: "2023-10-25", status: "completed" },
];
