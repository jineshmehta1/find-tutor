/**
 * Standardized Class / Grade Level Constants across Aacharya Academy
 */

export const INDIVIDUAL_CLASSES = [
    "LKG",
    "UKG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
];

export const STANDARD_CLASSES = [
    "Nursery",
    "LKG",
    "UKG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
];

export const ACADEMIC_SUBJECTS = [
    "Accountancy",
    "Applied Mathematics",
    "Artificial Intelligence",
    "Assamese",
    "Bengali",
    "Biology",
    "Business Studies",
    "Chemistry",
    "Computer",
    "Computer Applications",
    "Economics",
    "English",
    "Entrepreneurship",
    "Environmental Studies",
    "Fine Arts",
    "Geography",
    "Gujarati",
    "Hindi",
    "History",
    "Home Science",
    "Informatics Practices",
    "Information Technology",
    "Kannada",
    "Kashmiri",
    "Legal Studies",
    "Malayalam",
    "Marathi",
    "Mathematics",
    "Odia",
    "Physics",
    "Political Science",
    "Psychology",
    "Punjabi",
    "Sanskrit",
    "Science",
    "Social Science",
    "Sociology",
    "Tamil",
    "Telugu",
    "Urdu",
];

export const ACTIVITY_CATEGORIES: { category: string; activities: string[] }[] = [
    {
        category: "Mind & Indoor Activities",
        activities: [
            "Chess",
            "Carrom",
            "Rubik’s Cube",
            "Sudoku",
            "Puzzle Solving",
            "Memory Games",
        ],
    },
    {
        category: "Arts & Creative Skills",
        activities: [
            "Drawing",
            "Sketching",
            "Painting",
            "Art & Craft",
            "Clay Modelling",
            "Origami",
            "Calligraphy",
            "Handwriting",
            "Digital Art",
            "Creative Writing",
        ],
    },
    {
        category: "Music",
        activities: [
            "Vocal Music",
            "Carnatic Music",
            "Hindustani Music",
            "Western Vocal",
            "Keyboard",
            "Piano",
            "Guitar",
            "Violin",
            "Flute",
            "Tabla",
            "Mridangam",
            "Veena",
            "Drums",
            "Music Theory",
        ],
    },
    {
        category: "Dance & Performing Arts",
        activities: [
            "Classical Dance",
            "Folk Dance",
            "Bollywood Dance",
            "Western Dance",
            "Contemporary Dance",
            "Hip-Hop",
            "Ballet",
            "Acting",
            "Theatre / Drama",
            "Choreography",
        ],
    },
    {
        category: "Communication & Personal Development",
        activities: [
            "Spoken English",
            "Communication Skills",
            "Public Speaking",
            "Elocution",
            "Debate",
            "Storytelling",
            "Personality Development",
            "Leadership Skills",
            "Interview Skills",
            "Presentation Skills",
            "Voice & Pronunciation",
        ],
    },
    {
        category: "Technology & STEM",
        activities: [
            "Coding",
            "Programming",
            "Robotics",
            "Electronics",
            "Arduino",
            "Artificial Intelligence",
            "3D Modelling",
            "Game Development",
            "Web Development",
            "App Development",
            "STEM Projects",
        ],
    },
];

export const ACTIVITY_SUBJECTS = Array.from(
    new Set(ACTIVITY_CATEGORIES.flatMap((c) => c.activities))
);

export const ALL_STANDARD_SUBJECTS = Array.from(
    new Set([...ACADEMIC_SUBJECTS, ...ACTIVITY_SUBJECTS])
);

export const ACADEMIC_STREAMS = [
    {
        name: "All Academics",
        subjects: ACADEMIC_SUBJECTS,
    },
    {
        name: "Science & Mathematics",
        subjects: [
            "Mathematics",
            "Applied Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Science",
            "Environmental Studies",
        ],
    },
    {
        name: "Commerce & Management",
        subjects: [
            "Accountancy",
            "Business Studies",
            "Economics",
            "Entrepreneurship",
        ],
    },
    {
        name: "Humanities & Social Sciences",
        subjects: [
            "Social Science",
            "History",
            "Geography",
            "Political Science",
            "Sociology",
            "Psychology",
            "Legal Studies",
        ],
    },
    {
        name: "Computers & Information Tech",
        subjects: [
            "Computer",
            "Computer Applications",
            "Information Technology",
            "Informatics Practices",
            "Artificial Intelligence",
        ],
    },
    {
        name: "Languages & Literature",
        subjects: [
            "English",
            "Hindi",
            "Sanskrit",
            "Assamese",
            "Bengali",
            "Gujarati",
            "Kannada",
            "Kashmiri",
            "Malayalam",
            "Marathi",
            "Odia",
            "Punjabi",
            "Tamil",
            "Telugu",
            "Urdu",
        ],
    },
    {
        name: "Vocational & Applied Arts",
        subjects: [
            "Fine Arts",
            "Home Science",
        ],
    },
];

export interface SubjectSectionGroup {
    id: string;
    name: string;
    categoryType: "academic" | "activity";
    iconName: string;
    badge: string;
    description: string;
    subjects: string[];
}

export const ALL_SUBJECT_SECTIONS: SubjectSectionGroup[] = [
    {
        id: "academics",
        name: "Academic Subjects",
        categoryType: "academic",
        iconName: "book",
        badge: "Curriculum (LKG - 12)",
        description: "Core school & college curriculum subjects (Maths, Science, Commerce, Languages)",
        subjects: ACADEMIC_SUBJECTS,
    },
    ...ACTIVITY_CATEGORIES.map((c) => ({
        id: c.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: c.category,
        categoryType: "activity" as const,
        iconName: c.category.toLowerCase().includes("mind") ? "brain" :
                  c.category.toLowerCase().includes("art") ? "palette" :
                  c.category.toLowerCase().includes("music") ? "music" :
                  c.category.toLowerCase().includes("dance") ? "sparkles" :
                  c.category.toLowerCase().includes("communication") ? "message" : "cpu",
        badge: "Co-curricular & Skills",
        description: `Training and coaching in ${c.category.toLowerCase()}`,
        subjects: c.activities,
    })),
];

export const STANDARD_TEACHING_MODES = [
    { value: "Home Tutor", label: "At Student Home" },
    { value: "Online Tutor", label: "Online mode" },
    { value: "At Centre", label: "At Teacher Home" },
];

export const TEACHER_CLASS_LEVELS = [
    "LKG",
    "UKG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "Nursery",
];

/**
 * Universal & Robust Class Level Matcher.
 * Accurately maps selected individual class (e.g. "Class 3", "Class 10", "LKG") against teacher class data.
 */
export function matchesClassLevel(
    teacherClassesRaw: any,
    selectedClass: string,
    teacherSubjectsRaw?: any
): boolean {
    if (!selectedClass || selectedClass === "All" || selectedClass === "All Classes" || selectedClass === "All Grades") return true;

    const rawTokens: string[] = [];

    const extractTokens = (val: any) => {
        if (!val) return;
        if (Array.isArray(val)) {
            val.forEach((item) => extractTokens(item));
        } else if (typeof val === "string") {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                    parsed.forEach((item) => extractTokens(item));
                } else {
                    rawTokens.push(val);
                }
            } catch {
                rawTokens.push(val);
            }
        }
    };

    extractTokens(teacherClassesRaw);
    if (teacherSubjectsRaw) {
        extractTokens(teacherSubjectsRaw);
    }

    if (rawTokens.length === 0) return true; // Include tutors with unspecified levels

    const selClean = selectedClass.trim();
    const selLower = selClean.toLowerCase();
    
    // Extract number from selected class if present (e.g., "Class 3" -> 3, "Class 11" -> 11)
    const selNumMatch = selLower.match(/\b\d+\b/);
    const selNum = selNumMatch ? parseInt(selNumMatch[0], 10) : null;

    return rawTokens.some((token) => {
        if (!token) return false;
        const cLower = String(token).toLowerCase().trim();

        // 1. Universal / All match
        if (
            cLower.includes("all") ||
            cLower.includes("any") ||
            cLower.includes("nursery to") ||
            cLower.includes("1 to 12") ||
            cLower.includes("1-12") ||
            cLower.includes("k-12")
        ) {
            return true;
        }

        // 2. Exact word / phrase match
        if (cLower === selLower) {
            return true;
        }

        // 3. Exact LKG / UKG / Nursery matching
        if (selLower === "lkg" || selLower === "class lkg") {
            return /\blkg\b/i.test(cLower);
        }
        if (selLower === "ukg" || selLower === "class ukg") {
            return /\bukg\b/i.test(cLower);
        }
        if (selLower === "nursery" || selLower === "class nursery") {
            return /\bnursery\b/i.test(cLower);
        }

        // 4. Numbered class matching (e.g. "Class 3", "Class 10", "Class 11")
        if (selNum !== null) {
            // Check word boundary regex for "Class X" (e.g. "\bclass\s*3\b")
            const classWordRegex = new RegExp(`\\b(class\\s*|grade\\s*|std\\s*|standard\\s*)?${selNum}\\b`, "i");
            if (classWordRegex.test(cLower)) {
                // Ensure it's not a range where this number is excluded
                return true;
            }

            // Legacy Group check 1-5 (Primary / Class 1-5)
            if (selNum >= 1 && selNum <= 5 && (/\b(class\s*)?1\s*(?:-|to)\s*5\b/i.test(cLower) || cLower.includes("primary"))) {
                return true;
            }
            // Legacy Group check 6-8 (Middle / Class 6-8)
            if (selNum >= 6 && selNum <= 8 && (/\b(class\s*)?6\s*(?:-|to)\s*8\b/i.test(cLower) || cLower.includes("middle"))) {
                return true;
            }
            // Legacy Group check 9-10 (Secondary / Class 9-10)
            if (selNum >= 9 && selNum <= 10 && (/\b(class\s*)?9\s*(?:-|to)\s*10\b/i.test(cLower) || cLower.includes("secondary") || cLower.includes("high school"))) {
                return true;
            }
            // Legacy Group check 11-12 (Higher Secondary / Class 11-12)
            if (selNum >= 11 && selNum <= 12 && (/\b(class\s*)?11\s*(?:-|to)\s*12\b/i.test(cLower) || cLower.includes("higher secondary") || cLower.includes("inter") || cLower.includes("+2"))) {
                return true;
            }

            // General numeric range check (e.g., "Class 1-10", "1 to 12")
            const rangeMatches = cLower.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
            if (rangeMatches) {
                const start = parseInt(rangeMatches[1], 10);
                const end = parseInt(rangeMatches[2], 10);
                if (selNum >= start && selNum <= end) return true;
            }
        }

        // Degree / Graduation
        if (selLower.includes("degree") || selLower.includes("graduation")) {
            if (cLower.includes("degree") || cLower.includes("graduation") || cLower.includes("college") || cLower.includes("b.tech") || cLower.includes("b.sc")) return true;
        }

        // Competitive Exams
        if (selLower.includes("competitive") || selLower.includes("jee") || selLower.includes("neet") || selLower.includes("upsc")) {
            if (cLower.includes("competitive") || cLower.includes("entrance") || cLower.includes("jee") || cLower.includes("neet") || cLower.includes("exam")) return true;
        }

        return false;
    });
}

/**
 * Assigns an educational hierarchy rank to any class/grade level string.
 * Used to sort classes chronologically (Nursery -> LKG -> UKG -> Class 1..12 -> Degree -> Competitive).
 */
export function getClassLevelRank(cls: string): number {
    if (!cls || typeof cls !== "string") return 999;
    const clean = cls.trim();
    const lower = clean.toLowerCase();

    // Early childhood
    if (lower === "playgroup" || lower.includes("nursery") || lower.includes("pre-kg") || lower.includes("pre kg")) return 1;
    if (lower === "lkg" || lower.includes("jr") || lower === "kg 1" || lower === "kg1") return 2;
    if (lower === "ukg" || lower.includes("sr") || lower === "kg 2" || lower === "kg2" || lower === "kg" || lower.includes("kindergarten")) return 3;

    // Check for numeric range (e.g., "Class 1-5", "Class 9-10", "1 to 12")
    const rangeMatch = lower.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        return 10 + start + (end / 100);
    }

    // Numbered individual class (e.g. "Class 1", "Class 10", "Grade 5", "5th")
    const numMatch = lower.match(/(?:class|grade|std|standard|\b)\s*(\d+)(?:st|nd|rd|th)?\b/);
    if (numMatch && numMatch[1]) {
        const num = parseInt(numMatch[1], 10);
        if (num >= 1 && num <= 12) {
            return 10 + num;
        }
    }

    // Intermediate / Higher Secondary / +2
    if (lower.includes("intermediate") || lower.includes("inter") || lower.includes("higher secondary") || lower.includes("+2") || lower.includes("puc")) {
        return 22;
    }

    // Degree / Graduation / College
    if (lower.includes("degree") || lower.includes("graduation") || lower.includes("btech") || lower.includes("b.tech") || lower.includes("college") || lower.includes("undergraduate")) {
        return 30;
    }

    // Post-graduation / Masters
    if (lower.includes("post") || lower.includes("masters") || lower.includes("mtech") || lower.includes("mba")) {
        return 40;
    }

    // Competitive Exams
    if (lower.includes("jee") || lower.includes("neet") || lower.includes("upsc") || lower.includes("entrance") || lower.includes("competitive")) {
        return 50;
    }

    return 100;
}

/**
 * Sorts an array of class/grade levels chronologically in educational order.
 * Example: ["Class 7", "Class 1", "Class 3", "Class 2"] -> ["Class 1", "Class 2", "Class 3", "Class 7"]
 */
export function sortClassLevels(classes: (string | null | undefined)[]): string[] {
    if (!Array.isArray(classes)) return [];
    const valid = classes
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim());

    // Deduplicate while preserving case
    const uniqueMap = new Map<string, string>();
    for (const c of valid) {
        const key = c.toLowerCase();
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, c);
        }
    }

    const uniqueList = Array.from(uniqueMap.values());

    return uniqueList.sort((a, b) => {
        const rankA = getClassLevelRank(a);
        const rankB = getClassLevelRank(b);
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    });
}

/**
 * Sorts the class breakdown inside a subject string like "English (Class 7, Class 1, Class 3)"
 * into "English (Class 1, Class 3, Class 7)"
 */
export function sortSubjectLevels(sub: string): string {
    if (!sub || typeof sub !== "string") return sub;
    const match = sub.match(/^(.*?)\s*\((.*?)\)$/);
    if (!match) return sub;
    const title = match[1].trim();
    const rawLevels = match[2].split(",").map((s) => s.trim()).filter(Boolean);
    if (rawLevels.length === 0) return title;
    const sortedLevels = sortClassLevels(rawLevels);
    return `${title} (${sortedLevels.join(", ")})`;
}

/**
 * Produces a clean, concise class range summary from an array or JSON string.
 * Example: ["Class 7", "Class 1", "Class 3", ..., "Class 9"] -> "Class 1 - Class 9"
 */
export function formatClassSummary(rawClasses: any): string {
    let classes: string[] = [];
    if (Array.isArray(rawClasses)) {
        classes = rawClasses;
    } else if (typeof rawClasses === "string") {
        try {
            const parsed = JSON.parse(rawClasses);
            if (Array.isArray(parsed)) classes = parsed;
            else classes = rawClasses.split(",").map((s) => s.trim());
        } catch {
            classes = rawClasses.split(",").map((s) => s.trim());
        }
    }

    const sorted = sortClassLevels(classes);
    if (sorted.length === 0) return "All Grades";
    if (sorted.length === 1) return sorted[0];
    if (sorted.length <= 3) return sorted.join(", ");

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return `${first} - ${last}`;
}

