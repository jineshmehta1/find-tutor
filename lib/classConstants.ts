/**
 * Standardized Class / Grade Level Constants across Aacharya Academy
 */

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
    "Degree / Graduation",
    "Competitive Exams",
];

export const TEACHER_CLASS_LEVELS = [
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
    "Degree / Graduation",
    "Competitive Exams",
];

/**
 * Universal & Robust Class Level Matcher.
 * Accurately maps selected class (e.g. "Class 5") against teacher class data.
 */
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
    
    // Extract number from selected class if present (e.g., "Class 3" -> 3)
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

        // 2. Direct word / substring match
        if (cLower === selLower || cLower.includes(selLower)) {
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

        // 4. Group Level mapping when selectedClass is a numbered class (e.g. "Class 3")
        if (selNum !== null) {
            // Group check 1-5 (Primary / Class 1-5)
            if (selNum >= 1 && selNum <= 5 && (/\b(class\s*)?1\s*(?:-|to)\s*5\b/i.test(cLower) || cLower.includes("primary"))) {
                return true;
            }
            // Group check 6-8 (Middle / Class 6-8)
            if (selNum >= 6 && selNum <= 8 && (/\b(class\s*)?6\s*(?:-|to)\s*8\b/i.test(cLower) || cLower.includes("middle"))) {
                return true;
            }
            // Group check 9-10 (Secondary / Class 9-10)
            if (selNum >= 9 && selNum <= 10 && (/\b(class\s*)?9\s*(?:-|to)\s*10\b/i.test(cLower) || cLower.includes("secondary") || cLower.includes("high school"))) {
                return true;
            }
            // Group check 11-12 (Higher Secondary / Class 11-12)
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

            // Single number match (e.g., "Class 3")
            const numberMatches = cLower.match(/\b\d+\b/g);
            if (numberMatches) {
                if (numberMatches.map((n) => parseInt(n, 10)).includes(selNum)) {
                    return true;
                }
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

