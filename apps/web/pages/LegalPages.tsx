import React from 'react';
import { Shield, Lock, FileText, Cookie } from 'lucide-react';
import { useDocumentHead } from '@/lib/useDocumentHead';

const LegalLayout = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-12 border border-slate-200">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shrink-0 shadow-soft">
                    <Icon className="w-7 h-7" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">{title}</h1>
            </div>
            <div className="prose prose-slate max-w-none [&_h2]:text-primary [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-slate-800 [&_h3]:font-bold [&_p]:text-slate-600 [&_p]:leading-relaxed [&_li]:text-slate-600 [&_li]:mb-2 [&_a]:text-primary [&_a]:font-bold hover:[&_a]:text-accent transition-colors">
                {children}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span>Last updated: March 2026</span>
                <span className="font-bold text-slate-500">Let's Go Tutors Ltd</span>
            </div>
        </div>
    </div>
);

export function PrivacyPolicyPage() {
    useDocumentHead({
        title: "Privacy Policy",
        description: "Let's Go Tutors Privacy Policy. Learn how we collect, use, store and share personal information."
    });

    return (
        <LegalLayout title="Privacy Policy" icon={Lock}>
            <p className="text-lg text-slate-700 font-medium mb-8"><strong>Effective date:</strong> 7 March 2026</p>
            <p>At Let's Go Tutors, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store and share personal information when you use our website, create an account, book tuition, contact us, or otherwise interact with our services.</p>

            <h2>Who we are</h2>
            <p>Let's Go Tutors is an online tutoring and education platform. In this policy, “Let's Go Tutors”, “we”, “us” and “our” refer to the operator of the Let's Go Tutors website and services. If you publish this on your website, you should insert your registered business name, trading address, and contact email.</p>

            <h2>The personal data we collect</h2>
            <p>We may collect and process the following categories of personal data:</p>
            <ul>
                <li>identity data, such as name and date of birth;</li>
                <li>contact data, such as email address, phone number and billing address;</li>
                <li>account data, such as login credentials and profile details;</li>
                <li>learner data, such as year group, subject interests, academic goals and lesson history;</li>
                <li>parent or guardian data where a student is under 18;</li>
                <li>payment and transaction data, such as subscription status, invoices and billing records;</li>
                <li>communications data, including messages sent through our platform or support forms;</li>
                <li>technical data, such as IP address, browser type, device data and usage information;</li>
                <li>safeguarding-related information where reasonably necessary to protect students, tutors or the integrity of the platform.</li>
            </ul>

            <h2>How we use your data</h2>
            <p>We use personal data to:</p>
            <ul>
                <li>create and manage user accounts;</li>
                <li>arrange, deliver and administer tutoring sessions;</li>
                <li>process payments and subscriptions;</li>
                <li>communicate about bookings, changes, support requests and service updates;</li>
                <li>improve our platform, website performance and user experience;</li>
                <li>maintain security, prevent fraud and enforce our policies;</li>
                <li>comply with legal, regulatory and safeguarding obligations.</li>
            </ul>
            <p>Under UK GDPR, organisations must tell people the purposes of processing, the lawful bases relied on, how long data is kept, and who it is shared with.</p>

            <h2>Our lawful bases</h2>
            <p>Depending on the situation, we may rely on:</p>
            <ul>
                <li><strong>contract</strong> – where we need your data to provide tutoring services or manage your account;</li>
                <li><strong>legitimate interests</strong> – where necessary for running and improving Let's Go Tutors, preventing misuse, and maintaining platform safety;</li>
                <li><strong>legal obligation</strong> – where we must retain or disclose information for tax, fraud prevention, safeguarding or other legal reasons;</li>
                <li><strong>consent</strong> – where required, for example for certain marketing communications or optional cookies.</li>
            </ul>

            <h2>Sharing your data</h2>
            <p>We may share data with:</p>
            <ul>
                <li>tutors, where necessary to deliver lessons;</li>
                <li>payment processors and billing providers;</li>
                <li>technology and hosting providers;</li>
                <li>customer support, analytics and communication providers;</li>
                <li>professional advisers, insurers, regulators, law enforcement or safeguarding authorities where required.</li>
            </ul>
            <p>We do not sell your personal data.</p>

            <h2>International transfers</h2>
            <p>Where service providers process data outside the UK, we will take appropriate steps to protect it, including using lawful transfer mechanisms where required.</p>

            <h2>Data retention</h2>
            <p>We keep personal data only for as long as reasonably necessary for the purposes described in this policy, including account administration, legal compliance, safeguarding, dispute resolution and financial record-keeping.</p>

            <h2>Your rights</h2>
            <p>Subject to the law, you may have the right to:</p>
            <ul>
                <li>request access to your personal data;</li>
                <li>request correction of inaccurate data;</li>
                <li>request erasure in certain circumstances;</li>
                <li>object to certain processing;</li>
                <li>request restriction of processing;</li>
                <li>request transfer of data where applicable;</li>
                <li>withdraw consent where processing is based on consent;</li>
                <li>complain to the Information Commissioner’s Office.</li>
            </ul>

            <h2>Children’s privacy</h2>
            <p>Where Let's Go Tutors provides services to students under 18, we may require parental or guardian involvement depending on the learner’s age, the nature of the service, and applicable safeguarding requirements.</p>

            <h2>Security</h2>
            <p>We use appropriate technical and organisational measures to help protect personal data, although no online system can be guaranteed completely secure.</p>

            <h2>Contact us</h2>
            <p>For privacy questions or requests, contact: <strong>privacy@letsgotutors.com</strong><br />You may also contact the ICO if you are unhappy with how your data has been handled.</p>
        </LegalLayout>
    );
}

export function TermsPage() {
    useDocumentHead({
        title: "Terms & Conditions",
        description: "Let's Go Tutors Terms & Conditions. By accessing or using Let's Go Tutors, you agree to these terms."
    });

    return (
        <LegalLayout title="Terms & Conditions" icon={FileText}>
            <p className="text-lg text-slate-700 font-medium mb-8"><strong>Effective date:</strong> 7 March 2026</p>
            <p>These Terms & Conditions govern your use of the Let's Go Tutors website, platform and tutoring services. By accessing or using Let's Go Tutors, you agree to these terms.</p>

            <h2>1. About Let's Go Tutors</h2>
            <p>Let's Go Tutors provides access to educational services, including tutoring sessions, learning support, scheduling tools, digital content and related services.</p>

            <h2>2. Eligibility</h2>
            <p>You may use Let's Go Tutors only if you can lawfully enter into a contract. If the student is under 18, a parent or legal guardian may be required to register, manage bookings, approve payments, or supervise use of the platform.</p>

            <h2>3. Accounts</h2>
            <p>You are responsible for ensuring that account information is accurate and up to date. You must keep login details secure and must not share your account with unauthorised users. We may suspend or restrict accounts where we reasonably believe there has been misuse, fraud, abusive behaviour, safeguarding risk, or breach of these terms.</p>

            <h2>4. Bookings and services</h2>
            <p>Tutoring sessions are subject to tutor availability, confirmation, payment status and platform rules. We may change tutors, reschedule sessions, or amend service delivery where reasonably necessary, including for safeguarding, operational or technical reasons.</p>

            <h2>5. Fees and payment</h2>
            <p>All fees will be shown before purchase. By purchasing a lesson, package or subscription, you agree to pay the displayed charges and any clearly stated recurring fees. UK rules for online and distance selling require businesses to provide key pre-contract information including business identity, price, billing period, contract duration, cancellation conditions and payment arrangements before an order is placed.</p>

            <h2>6. Cancellations and refunds</h2>
            <p>Our cancellation, refund and rescheduling rules will apply as stated at checkout or in the relevant booking policy. Nothing in these terms removes any statutory rights you may have under consumer law.</p>

            <h2>7. User conduct</h2>
            <p>You must not:</p>
            <ul>
                <li>use Let's Go Tutors for unlawful, harmful or abusive purposes;</li>
                <li>harass, threaten or discriminate against tutors, students, parents or staff;</li>
                <li>record, reproduce or distribute sessions without permission where not allowed;</li>
                <li>upload malicious software or attempt to interfere with platform security;</li>
                <li>impersonate another person or provide false information.</li>
            </ul>

            <h2>8. Safeguarding and safety</h2>
            <p>Where students under 18 use Let's Go Tutors, all users must comply with our Safeguarding Use Policy. We may monitor, restrict, suspend or report activity where we reasonably consider it necessary to protect learners, tutors, staff or the wider public.</p>

            <h2>9. Intellectual property</h2>
            <p>Unless otherwise stated, all content on the Let's Go Tutors website and platform, including branding, text, graphics, lesson materials and software elements, belongs to Let's Go Tutors or its licensors. You may not copy, redistribute or commercially exploit content without permission.</p>

            <h2>10. Limitation of liability</h2>
            <p>We do not exclude or limit liability where it would be unlawful to do so. Otherwise, to the extent permitted by law, Let's Go Tutors is not liable for indirect or consequential loss, loss of profit, or losses arising from matters outside our reasonable control. Any limitations must still be fair and transparent under the Consumer Rights Act 2015. Unfair consumer terms are not binding.</p>

            <h2>11. Termination</h2>
            <p>We may suspend or terminate access where these terms are breached, payment is overdue, or we reasonably believe suspension is necessary for legal, security or safeguarding reasons.</p>

            <h2>12. Changes to these terms</h2>
            <p>We may update these terms from time to time. The latest version posted on our website will apply from its effective date.</p>

            <h2>13. Governing law</h2>
            <p>These terms are governed by the law of England and Wales, unless mandatory local consumer law applies otherwise.</p>
        </LegalLayout>
    );
}

export function CookiePolicyPage() {
    useDocumentHead({
        title: "Cookie Policy",
        description: "Let's Go Tutors Cookie Policy. Explains how we use cookies and similar technologies on our website."
    });

    return (
        <LegalLayout title="Cookie Policy" icon={Cookie}>
            <p className="text-lg text-slate-700 font-medium mb-8"><strong>Effective date:</strong> 7 March 2026</p>
            <p>This Cookie Policy explains how Let's Go Tutors uses cookies and similar technologies on our website and platform.</p>

            <h2>What are cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. Similar technologies can include scripts, pixels, local storage and device-based identifiers. The ICO explains that PECR applies not only to traditional cookies, but also to similar technologies used to store or access information on a user’s device.</p>

            <h2>Why we use cookies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
                <li>keep users signed in;</li>
                <li>remember preferences and settings;</li>
                <li>support security and fraud prevention;</li>
                <li>measure performance and improve our services;</li>
                <li>understand how visitors use the website;</li>
                <li>support marketing or advertising where applicable.</li>
            </ul>

            <h2>Types of cookies we may use</h2>
            <h3>Strictly necessary cookies</h3>
            <p>These are required for the operation of the website or platform, such as authentication, session management, security, payment flow integrity, and load balancing.</p>

            <h3>Functional cookies</h3>
            <p>These remember choices such as saved preferences, region, language or interface settings.</p>

            <h3>Analytics cookies</h3>
            <p>These help us understand traffic, usage patterns and site performance.</p>

            <h3>Advertising or targeting cookies</h3>
            <p>These may be used to measure campaigns, personalise promotions or limit repeated adverts where applicable.</p>

            <h2>Consent</h2>
            <p>Where required by law, Let's Go Tutors will ask for your consent before placing non-essential cookies on your device. The ICO says organisations generally need to give clear information and obtain consent for non-essential cookies, while certain strictly necessary technologies may be exempt.</p>

            <h2>How to manage cookies</h2>
            <p>You can manage cookie preferences through:</p>
            <ul>
                <li>our cookie banner or cookie settings tool;</li>
                <li>your browser settings;</li>
                <li>device-level privacy controls where available.</li>
            </ul>
            <p>Please note that disabling some cookies may affect site functionality.</p>

            <h2>Third-party cookies</h2>
            <p>Some cookies may be set by third-party service providers, such as payment providers, analytics providers, video services, or embedded tools. These third parties may process information in accordance with their own privacy policies.</p>

            <h2>Updates to this policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, law or our services.</p>

            <h2>Contact us</h2>
            <p>For questions about our use of cookies, contact: <strong>privacy@letsgotutors.com</strong></p>
        </LegalLayout>
    );
}

export function SafeguardingPage() {
    useDocumentHead({
        title: "Safeguarding Use Policy",
        description: "Let's Go Tutors Safeguarding Use Policy. Providing a safe, respectful and protective environment for all learners."
    });

    return (
        <LegalLayout title="Safeguarding Policy" icon={Shield}>
            <p className="text-lg text-slate-700 font-medium mb-8"><strong>Effective date:</strong> 7 March 2026</p>
            <p>Let's Go Tutors is committed to providing a safe, respectful and protective environment for all learners, especially children and young people. This Safeguarding Use Policy sets out the expectations for students, parents, guardians, tutors, staff and any person using the Let's Go Tutors platform.</p>
            <p>This policy is informed by UK safeguarding principles. The Department for Education’s <em>Keeping Children Safe in Education</em> guidance states that safeguarding is everyone’s responsibility and that people working with children should understand their responsibilities and have clear reporting mechanisms.</p>

            <h2>1. Purpose</h2>
            <p>The purpose of this policy is to:</p>
            <ul>
                <li>protect students from harm, abuse, exploitation, neglect and inappropriate conduct;</li>
                <li>set standards for safe conduct on and off the Let's Go Tutors platform;</li>
                <li>explain how concerns should be raised and handled;</li>
                <li>support a culture of early reporting and appropriate action.</li>
            </ul>

            <h2>2. Scope</h2>
            <p>This policy applies to:</p>
            <ul>
                <li>all Let's Go Tutors staff;</li>
                <li>all tutors;</li>
                <li>students using Let's Go Tutors;</li>
                <li>parents and guardians;</li>
                <li>any third party accessing Let's Go Tutors services or systems.</li>
            </ul>

            <h2>3. Expected standards of behaviour</h2>
            <p>All users must:</p>
            <ul>
                <li>behave respectfully and professionally;</li>
                <li>use appropriate language and conduct in all sessions and messages;</li>
                <li>avoid bullying, harassment, intimidation, grooming or coercive behaviour;</li>
                <li>not request, send or store inappropriate, sexual, exploitative, violent or degrading content;</li>
                <li>follow Let's Go Tutors’s reporting and escalation procedures where concerns arise.</li>
            </ul>

            <h2>4. Tutor conduct</h2>
            <p>Tutors must:</p>
            <ul>
                <li>maintain professional boundaries at all times;</li>
                <li>communicate through approved Let's Go Tutors channels where possible;</li>
                <li>avoid private or secretive contact with students outside authorised arrangements;</li>
                <li>not exchange personal contact details unless expressly authorised by Let's Go Tutors;</li>
                <li>never meet a child in person through Let's Go Tutors without appropriate parental knowledge, risk controls and explicit approval where required;</li>
                <li>report any safeguarding concern immediately.</li>
            </ul>

            <h2>5. Parent and guardian responsibilities</h2>
            <p>Parents or guardians should:</p>
            <ul>
                <li>provide accurate contact and emergency information;</li>
                <li>supervise students where appropriate for their age and needs;</li>
                <li>report concerns, unusual behaviour or safety issues promptly;</li>
                <li>ensure students understand respectful and safe online behaviour.</li>
            </ul>

            <h2>6. Session safety</h2>
            <p>Let's Go Tutors may use safety measures such as:</p>
            <ul>
                <li>account verification;</li>
                <li>monitored communications;</li>
                <li>session records or audit logs where lawfully used;</li>
                <li>platform restrictions or moderation tools;</li>
                <li>escalation to internal safeguarding leads or external authorities where required.</li>
            </ul>

            <h2>7. Reporting concerns</h2>
            <p>Any safeguarding concern must be reported as soon as possible to <strong>safeguarding@letsgotutors.com</strong>. Concerns may include:</p>
            <ul>
                <li>inappropriate messages or behaviour;</li>
                <li>attempts to move communications off-platform improperly;</li>
                <li>signs of abuse, exploitation, neglect or self-harm risk;</li>
                <li>discriminatory, threatening or sexually inappropriate conduct;</li>
                <li>any situation where a child or vulnerable person may be at risk.</li>
            </ul>

            <h2>8. Action we may take</h2>
            <p>Where we identify a safeguarding concern, Let's Go Tutors may:</p>
            <ul>
                <li>suspend or restrict accounts;</li>
                <li>investigate communications or activity where lawful and necessary;</li>
                <li>contact parents or guardians where appropriate;</li>
                <li>refer matters to social services, police, local authorities, schools, or other relevant agencies;</li>
                <li>retain relevant information where required for safeguarding, legal or investigative purposes.</li>
            </ul>

            <h2>9. Confidentiality</h2>
            <p>Safeguarding information will be handled sensitively, but it may be shared on a need-to-know basis where necessary to protect a child or comply with the law. Safeguarding should not be kept secret where doing so could place someone at risk.</p>

            <h2>10. Review</h2>
            <p>This policy will be reviewed regularly and updated where needed to reflect legal, operational and safeguarding developments.</p>
        </LegalLayout>
    );
}
