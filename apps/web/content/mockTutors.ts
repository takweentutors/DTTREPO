// ──────────────────────────────────────────────────────────
// Mock Tutor Database — 16 tutors for booking funnel
// ──────────────────────────────────────────────────────────

export interface MockTutor {
    id: string;
    name: string;
    subjects: string[]; // matching subject slugs
    lectureTypes: LectureType[];
    availability: DayAvailability[];
    rating: number;
    reviewCount: number;
    bio: string;
    imageUrl: string;
    qualifications: string[];
    yearsExperience: number;
}

export type LectureType = '1:1' | '2:1' | '3:1' | '5:1' | '6:1' | '10:1';

export interface DayAvailability {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    slots: string[]; // e.g. ["09:00","10:00","14:00","15:00","16:00"]
}

// Helper to make availability easy
const weekday = (day: DayAvailability['day'], ...slots: string[]): DayAvailability => ({ day, slots });

export const mockTutors: MockTutor[] = [
    {
        id: 'tutor-1',
        name: 'Dr. Rasha Aziz',
        subjects: ['gcse-maths', 'a-level-maths', 'a-level-further-maths', '11-plus-maths'],
        lectureTypes: ['1:1', '2:1', '3:1'],
        availability: [
            weekday('Monday', '16:00', '17:00', '18:00'),
            weekday('Wednesday', '16:00', '17:00', '18:00'),
            weekday('Friday', '16:00', '17:00'),
            weekday('Saturday', '10:00', '11:00', '12:00'),
        ],
        rating: 5.0, reviewCount: 48,
        bio: 'PhD in Mathematics with 15 years of teaching experience. Specialises in exam technique and building confidence.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-1',
        qualifications: ['PhD Mathematics (Imperial)', 'PGCE'],
        yearsExperience: 15,
    },
    {
        id: 'tutor-2',
        name: 'James Wilson',
        subjects: ['gcse-physics', 'a-level-physics', 'gcse-combined-science'],
        lectureTypes: ['1:1', '2:1'],
        availability: [
            weekday('Monday', '15:30', '16:30'),
            weekday('Thursday', '15:30', '16:30', '17:30'),
            weekday('Saturday', '09:00', '10:00', '11:00'),
        ],
        rating: 4.8, reviewCount: 35,
        bio: 'Former engineer turned educator. Makes complex physics concepts easy using real-world examples.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-2',
        qualifications: ['MEng Engineering (Bristol)', 'QTS'],
        yearsExperience: 8,
    },
    {
        id: 'tutor-3',
        name: 'Emily Chen',
        subjects: ['gcse-biology', 'a-level-biology', 'gcse-combined-science', 'btec-health-social-care'],
        lectureTypes: ['1:1', '2:1', '3:1'],
        availability: [
            weekday('Tuesday', '16:00', '17:00', '18:00'),
            weekday('Thursday', '16:00', '17:00'),
            weekday('Sunday', '10:00', '11:00', '12:00'),
        ],
        rating: 5.0, reviewCount: 42,
        bio: 'Medical student with a passion for biology. Helps students master the syllabus and prepare for medicine applications.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-3',
        qualifications: ['BSc Biomedical Sciences (UCL)'],
        yearsExperience: 5,
    },
    {
        id: 'tutor-4',
        name: 'Marcus Johnson',
        subjects: ['gcse-english-literature', 'gcse-english-language', 'a-level-english-literature', 'a-level-english-language'],
        lectureTypes: ['1:1', '2:1', '3:1', '5:1'],
        availability: [
            weekday('Monday', '14:00', '15:00', '16:00'),
            weekday('Wednesday', '14:00', '15:00', '16:00'),
            weekday('Friday', '14:00', '15:00'),
        ],
        rating: 4.7, reviewCount: 29,
        bio: 'Published author and experienced tutor. Specialising in essay writing skills and critical analysis.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-4',
        qualifications: ['MA English Literature (Oxford)', 'PGCE'],
        yearsExperience: 10,
    },
    {
        id: 'tutor-5',
        name: 'Sofia Rodriguez',
        subjects: ['gcse-spanish', 'a-level-spanish', 'gcse-french', 'a-level-french'],
        lectureTypes: ['1:1', '2:1'],
        availability: [
            weekday('Tuesday', '09:00', '10:00', '16:00', '17:00'),
            weekday('Thursday', '09:00', '10:00', '16:00'),
            weekday('Saturday', '09:00', '10:00', '11:00'),
        ],
        rating: 4.9, reviewCount: 37,
        bio: 'Native speaker and certified linguist. Immersive teaching style that builds fluency and confidence fast.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-5',
        qualifications: ['BA Modern Languages (Cambridge)', 'CELTA'],
        yearsExperience: 7,
    },
    {
        id: 'tutor-6',
        name: 'David Okonkwo',
        subjects: ['gcse-chemistry', 'a-level-chemistry', 'gcse-combined-science'],
        lectureTypes: ['1:1', '2:1', '3:1'],
        availability: [
            weekday('Monday', '17:00', '18:00', '19:00'),
            weekday('Wednesday', '17:00', '18:00'),
            weekday('Saturday', '10:00', '11:00', '12:00'),
        ],
        rating: 4.9, reviewCount: 31,
        bio: 'Pharmaceutical chemist bringing real lab experience into tutoring. Makes reactions click.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-6',
        qualifications: ['MChem Chemistry (Edinburgh)', 'PhD (in progress)'],
        yearsExperience: 6,
    },
    {
        id: 'tutor-7',
        name: 'Hannah Patel',
        subjects: ['gcse-history', 'a-level-history', 'gcse-religious-studies'],
        lectureTypes: ['1:1', '2:1', '5:1'],
        availability: [
            weekday('Tuesday', '15:00', '16:00', '17:00'),
            weekday('Thursday', '15:00', '16:00'),
            weekday('Sunday', '11:00', '12:00', '13:00'),
        ],
        rating: 4.8, reviewCount: 25,
        bio: 'History graduate with a knack for making the past come alive. Focus on source analysis and essay structure.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-7',
        qualifications: ['BA History (KCL)', 'PGCE'],
        yearsExperience: 9,
    },
    {
        id: 'tutor-8',
        name: 'Amir Hassan',
        subjects: ['gcse-computer-science', 'a-level-computer-science', 'gcse-maths'],
        lectureTypes: ['1:1', '2:1'],
        availability: [
            weekday('Monday', '18:00', '19:00'),
            weekday('Wednesday', '18:00', '19:00'),
            weekday('Friday', '16:00', '17:00', '18:00'),
            weekday('Saturday', '14:00', '15:00'),
        ],
        rating: 4.9, reviewCount: 22,
        bio: 'Software engineer at a leading tech firm. Teaches programming, algorithms, and computational thinking.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-8',
        qualifications: ['MSc Computer Science (Imperial)'],
        yearsExperience: 4,
    },
    {
        id: 'tutor-9',
        name: 'Lucy Thompson',
        subjects: ['gcse-geography', 'a-level-geography'],
        lectureTypes: ['1:1', '2:1', '3:1', '5:1'],
        availability: [
            weekday('Monday', '15:00', '16:00'),
            weekday('Thursday', '15:00', '16:00', '17:00'),
            weekday('Saturday', '09:00', '10:00'),
        ],
        rating: 4.6, reviewCount: 18,
        bio: 'Environmental scientist passionate about geography fieldwork and case study mastery.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-9',
        qualifications: ['BSc Geography (Durham)'],
        yearsExperience: 5,
    },
    {
        id: 'tutor-10',
        name: 'Oliver Wright',
        subjects: ['gcse-business', 'a-level-business', 'a-level-economics', 'btec-business'],
        lectureTypes: ['1:1', '2:1', '5:1', '6:1'],
        availability: [
            weekday('Tuesday', '17:00', '18:00', '19:00'),
            weekday('Friday', '15:00', '16:00'),
            weekday('Sunday', '10:00', '11:00'),
        ],
        rating: 4.7, reviewCount: 20,
        bio: 'Former City analyst who brings real-world business knowledge to the classroom.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-10',
        qualifications: ['BSc Economics (LSE)', 'MBA'],
        yearsExperience: 8,
    },
    {
        id: 'tutor-11',
        name: 'Fatima Al-Rashid',
        subjects: ['gcse-arabic', '11-plus-english', '11-plus-verbal-reasoning', '11-plus-non-verbal-reasoning'],
        lectureTypes: ['1:1', '2:1'],
        availability: [
            weekday('Monday', '09:00', '10:00', '11:00'),
            weekday('Wednesday', '09:00', '10:00'),
            weekday('Saturday', '09:00', '10:00', '11:00', '12:00'),
        ],
        rating: 5.0, reviewCount: 33,
        bio: 'Bilingual educator specialising in 11+ preparation and Arabic. Patient, thorough approach.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-11',
        qualifications: ['BA Education (Birmingham)', 'QTS'],
        yearsExperience: 12,
    },
    {
        id: 'tutor-12',
        name: 'Tom Bradley',
        subjects: ['gcse-pe', 'btec-sport', 'a-level-psychology', 'btec-health-social-care', 'btec-business'],
        lectureTypes: ['1:1', '3:1', '5:1', '10:1'],
        availability: [
            weekday('Tuesday', '08:00', '09:00'),
            weekday('Thursday', '08:00', '09:00', '18:00'),
            weekday('Saturday', '08:00', '09:00', '10:00'),
        ],
        rating: 4.5, reviewCount: 15,
        bio: 'Sports science graduate and PE teacher. Covers both practical and theoretical components.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-12',
        qualifications: ['BSc Sports Science (Loughborough)', 'PGCE'],
        yearsExperience: 6,
    },
    {
        id: 'tutor-13',
        name: 'Grace Kim',
        subjects: ['gcse-art', 'a-level-art', 'gcse-design-technology'],
        lectureTypes: ['1:1', '2:1'],
        availability: [
            weekday('Wednesday', '14:00', '15:00', '16:00'),
            weekday('Friday', '14:00', '15:00'),
            weekday('Sunday', '14:00', '15:00', '16:00'),
        ],
        rating: 4.8, reviewCount: 19,
        bio: 'Fine art graduate from the Slade School. Helps students develop portfolios and refine technique.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-13',
        qualifications: ['BA Fine Art (UCL Slade)', 'MA Arts Education'],
        yearsExperience: 7,
    },
    {
        id: 'tutor-14',
        name: 'Priya Sharma',
        subjects: ['gcse-sociology', 'a-level-sociology', 'a-level-politics'],
        lectureTypes: ['1:1', '2:1', '3:1'],
        availability: [
            weekday('Monday', '16:00', '17:00'),
            weekday('Tuesday', '16:00', '17:00'),
            weekday('Thursday', '16:00', '17:00', '18:00'),
        ],
        rating: 4.7, reviewCount: 14,
        bio: 'Social sciences researcher with a gift for making theory accessible and exam-ready.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-14',
        qualifications: ['MSc Sociology (Warwick)'],
        yearsExperience: 5,
    },
    {
        id: 'tutor-15',
        name: 'Daniel Murphy',
        subjects: ['gcse-music', 'a-level-music', 'gcse-drama'],
        lectureTypes: ['1:1'],
        availability: [
            weekday('Wednesday', '16:00', '17:00', '18:00'),
            weekday('Saturday', '10:00', '11:00', '12:00', '13:00'),
            weekday('Sunday', '10:00', '11:00'),
        ],
        rating: 4.9, reviewCount: 21,
        bio: 'Professional musician and ABRSM examiner. Covers theory, composition, and performance.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-15',
        qualifications: ['BMus (Royal Academy of Music)', 'LRAM'],
        yearsExperience: 11,
    },
    {
        id: 'tutor-16',
        name: 'Zara Ahmed',
        subjects: ['11-plus-maths', '11-plus-english', 'gcse-maths', 'gcse-english-language'],
        lectureTypes: ['1:1', '2:1', '3:1', '5:1', '6:1', '10:1'],
        availability: [
            weekday('Monday', '09:00', '10:00', '15:00', '16:00'),
            weekday('Tuesday', '09:00', '10:00', '15:00'),
            weekday('Wednesday', '09:00', '10:00', '15:00', '16:00'),
            weekday('Thursday', '09:00', '10:00', '15:00'),
            weekday('Friday', '09:00', '10:00'),
        ],
        rating: 4.8, reviewCount: 55,
        bio: 'Primary and junior school specialist with excellent 11+ pass rates across all exam boards.',
        imageUrl: 'https://i.pravatar.cc/150?u=tutor-16',
        qualifications: ['BEd Primary Education (IOE)', 'SEN Certified'],
        yearsExperience: 14,
    },
];

// ──────────────────────────────────────────────────────────
// Tutor Matching Algorithm
// ──────────────────────────────────────────────────────────

export interface MatchCriteria {
    subjectSlug: string;
    preferredDays?: string[];
    preferredTimes?: string[];
    preferredLectureType?: LectureType;
}

export interface ScoredTutor {
    tutor: MockTutor;
    score: number;
    matchReasons: string[];
}

export function matchTutors(criteria: MatchCriteria): ScoredTutor[] {
    const results: ScoredTutor[] = [];

    for (const tutor of mockTutors) {
        // Must match subject
        if (!tutor.subjects.includes(criteria.subjectSlug)) continue;

        let score = 0;
        const reasons: string[] = [];

        // Base: subject match
        score += 10;
        reasons.push('Teaches this subject');

        // Availability overlap
        if (criteria.preferredDays?.length) {
            const overlap = tutor.availability.filter(a =>
                criteria.preferredDays!.includes(a.day)
            ).length;
            if (overlap > 0) {
                score += overlap * 3;
                reasons.push(`Available on ${overlap} preferred day(s)`);
            }
        }

        // Time overlap
        if (criteria.preferredTimes?.length && criteria.preferredDays?.length) {
            let timeOverlap = 0;
            for (const avail of tutor.availability) {
                if (criteria.preferredDays.includes(avail.day)) {
                    for (const slot of avail.slots) {
                        if (criteria.preferredTimes.includes(slot)) timeOverlap++;
                    }
                }
            }
            if (timeOverlap > 0) {
                score += timeOverlap * 2;
                reasons.push(`${timeOverlap} time slot(s) match`);
            }
        }

        // Lecture type match
        if (criteria.preferredLectureType) {
            if (tutor.lectureTypes.includes(criteria.preferredLectureType)) {
                score += 5;
                reasons.push(`Offers ${criteria.preferredLectureType} sessions`);
            }
        }

        // Rating bonus
        score += tutor.rating * 2;
        if (tutor.rating >= 4.8) reasons.push('Highly rated');

        // Experience bonus
        if (tutor.yearsExperience >= 10) {
            score += 3;
            reasons.push('10+ years experience');
        }

        results.push({ tutor, score, matchReasons: reasons });
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
}

export function getTutorsForSubject(subjectSlug: string): MockTutor[] {
    return mockTutors.filter(t => t.subjects.includes(subjectSlug));
}
