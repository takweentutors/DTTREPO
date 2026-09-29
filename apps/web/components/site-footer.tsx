
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.5z"></path>
    </svg>
);

export function SiteFooter() {
    return (
        <footer className="bg-[#ece3d5] text-[#2f271f] pt-10 sm:pt-12 pb-6 border-t border-[#d5c8b6]">
            <div className="container-custom grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
                {/* Brand — full width on mobile */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <BrandLogo markClassName="h-10 w-10" />
                    <p className="text-sm text-[#695a4a] leading-relaxed">
                        Launch your learning to new heights — tutoring that takes you further.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#847160] hover:text-secondary transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#847160] hover:text-secondary transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#847160] hover:text-secondary transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#847160] hover:text-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-[#847160] hover:text-secondary transition-colors"><TikTokIcon className="w-5 h-5" /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-primary font-bold mb-3 sm:mb-4">Subjects</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/subjects/gcse-maths" className="text-[#695a4a] hover:text-secondary transition-colors">GCSE Maths</a></li>
                        <li><a href="/subjects/gcse-english-literature" className="text-[#695a4a] hover:text-secondary transition-colors">English Literature</a></li>
                        <li><a href="/subjects/gcse-biology" className="text-[#695a4a] hover:text-secondary transition-colors">Biology</a></li>
                        <li><a href="/subjects/gcse-chemistry" className="text-[#695a4a] hover:text-secondary transition-colors">Chemistry</a></li>
                        <li><a href="/subjects" className="text-secondary font-bold hover:underline transition-colors">View All Subjects</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-primary font-bold mb-3 sm:mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-[#695a4a]">
                        <li><a href="/about-the-lms" className="hover:text-secondary transition-colors">About Us</a></li>
                        <li><a href="/careers" className="hover:text-secondary transition-colors">Careers</a></li>
                        <li><a href="/faq" className="hover:text-secondary transition-colors">FAQ</a></li>
                        <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-primary font-bold mb-3 sm:mb-4">Get in Touch</h4>
                    <ul className="space-y-3 text-sm text-[#695a4a]">
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <a href="mailto:info@letsgotutors.com" className="hover:text-primary transition-colors break-all">info@letsgotutors.com</a>
                        </li>
                        <li className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span>+44 20 7123 4567</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span>London, United Kingdom</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-primary font-bold mb-3 sm:mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-[#695a4a]">
                        <li><a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                        <li><a href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                        <li><a href="/safeguarding" className="hover:text-primary transition-colors">Safeguarding</a></li>
                    </ul>
                </div>
            </div>
            <div className="container-custom mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#d2c3af] text-center text-sm text-[#7a6a59]">
                © {new Date().getFullYear()} Let's Go Tutors. All rights reserved.
            </div>
        </footer>
    );
}
