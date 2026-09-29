// ──────────────────────────────────────────────────────────
// Email service (mock, extensible later)
// ──────────────────────────────────────────────────────────

export interface BookingConfirmationPayload {
 studentName: string;
 studentEmail: string;
 subjectName: string;
 subjectSlug: string;
 tutorName: string;
 nextLessonDate: string; // ISO date-time
 nextLessonTime: string; // display time e.g. "16:00 – 17:00"
 frequency: string;
 sessionLength: number; // minutes
 planTier: string;
 amountPaid: string; // e.g. "£45.00"
}

interface SentEmail {
 id: string;
 type: 'booking_confirmation';
 payload: BookingConfirmationPayload;
 sentAt: string;
 status: 'sent' | 'failed';
}

const STORAGE_KEY = 'lgt_sent_emails';

function getSentEmails(): SentEmail[] {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 return raw ? JSON.parse(raw) : [];
 } catch { return []; }
}

function storeSentEmail(email: SentEmail): void {
 const emails = getSentEmails();
 emails.unshift(email);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(emails.slice(0, 50)));
}

/**
 * Send a booking confirmation email.
 * Currently logs to console + stores in localStorage.
 * Swap implementation to real API call later without changing callers.
 */
export async function sendBookingConfirmationEmail(
 payload: BookingConfirmationPayload
): Promise<{ success: boolean; emailId: string }> {
 const emailId = `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

 console.log('📧 [Email Service] Booking confirmation email queued:');
 console.log(' To:', payload.studentEmail);
 console.log(' Subject: Booking Confirmed — ' + payload.subjectName);
 console.log(' Tutor:', payload.tutorName);
 console.log(' Next Lesson:', payload.nextLessonDate);
 console.log(' Payload:', payload);

 storeSentEmail({
 id: emailId,
 type: 'booking_confirmation',
 payload,
 sentAt: new Date().toISOString(),
 status: 'sent',
 });

 return { success: true, emailId };
}

/**
 * Get all stored "sent" emails (for in-app preview)
 */
export function getStoredEmails(): SentEmail[] {
 return getSentEmails();
}

/**
 * Clear all stored emails
 */
export function clearStoredEmails(): void {
 localStorage.removeItem(STORAGE_KEY);
}

/**
 * Render email body as HTML string (for preview)
 */
export function renderBookingEmailHtml(payload: BookingConfirmationPayload): string {
 const lessonDate = new Date(payload.nextLessonDate);
 const formattedDate = lessonDate.toLocaleDateString('en-GB', {
 weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
 });

 return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Booking Confirmed</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
<div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
 <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:32px 24px;text-align:center;">
 <div style="width:48px;height:48px;background:#f97316;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
 <span style="color:#fff;font-weight:900;font-size:24px;">T</span>
 </div>
 <h1 style="color:#fff;font-size:24px;margin:0 0 8px;">Booking Confirmed! 🎉</h1>
 <p style="color:#94a3b8;margin:0;font-size:14px;">Your tutoring session is all set.</p>
 </div>
 <div style="padding:32px 24px;">
 <p style="color:#334155;font-size:16px;margin:0 0 24px;">Hi ${payload.studentName},</p>
 <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">
 Great news — your <strong>${payload.subjectName}</strong> tutoring has been confirmed. Here are the details:
 </p>
 <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
 <table style="width:100%;border-collapse:collapse;font-size:14px;">
 <tr><td style="padding:8px 0;color:#64748b;">Subject</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${payload.subjectName}</td></tr>
 <tr><td style="padding:8px 0;color:#64748b;">Tutor</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${payload.tutorName}</td></tr>
 <tr><td style="padding:8px 0;color:#64748b;">Next Lesson</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${formattedDate}</td></tr>
 <tr><td style="padding:8px 0;color:#64748b;">Time</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${payload.nextLessonTime}</td></tr>
 <tr><td style="padding:8px 0;color:#64748b;">Duration</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${payload.sessionLength} minutes</td></tr>
 <tr><td style="padding:8px 0;color:#64748b;">Frequency</td>
 <td style="padding:8px 0;color:#1e293b;font-weight:600;text-align:right;">${payload.frequency}</td></tr>
 </table>
 </div>
 <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">
 You can view your upcoming sessions and manage bookings from your dashboard.
 </p>
 <div style="text-align:center;margin-bottom:24px;">
 <a href="https://letsgotutors.com/student/dashboard"
 style="display:inline-block;background:linear-gradient(135deg,#f97316,#f59e0b);color:#fff;padding:12px 32px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:14px;">
 Go to Dashboard →
 </a>
 </div>
 </div>
 <div style="border-top:1px solid #e2e8f0;padding:24px;text-align:center;">
 <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">
 Let's Go Tutors — A different kind of tuition agency.
 </p>
 <p style="color:#94a3b8;font-size:12px;margin:0;">
 <a href="mailto:info@letsgotutors.com" style="color:#f97316;">info@letsgotutors.com</a>
 </p>
 </div>
</div>
</div>
</body></html>`.trim();
}
