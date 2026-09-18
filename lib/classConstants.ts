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
export function matchesClassLevel(teacherClassesRaw: any, selectedClass: string): boolean {
    if (!selectedClass || selectedClass === "All" || selectedClass === "All Classes" || selectedClass === "All Grades") return true;
    if (!teacherClassesRaw) return true; // Include tutors who teach all levels

    let classesArray: string[] = [];
    if (Array.isArray(teacherClassesRaw)) {
        classesArray = teacherClassesRaw;
    } else if (typeof teacherClassesRaw === "string") {
        try {
            const parsed = JSON.parse(teacherClassesRaw);
            classesArray = Array.isArray(parsed) ? parsed : [teacherClassesRaw];
        } catch {
            classesArray = [teacherClassesRaw];
        }
    }

    if (classesArray.length === 0) return true; // Empty array means available for all classes

    const selLower = selectedClass.toLowerCase().trim();
    const selNumMatch = selLower.match(/\d+/);
    const selNum = selNumMatch ? parseInt(selNumMatch[0], 10) : null;

    return classesArray.some((c: string) => {
        if (!c) return false;
        const cLower = String(c).toLowerCase().trim();

        // 1. Universal / All match
        if (
            cLower.includes("all") ||
            cLower.includes("any") ||
            cLower.includes("nursery to") ||
            cLower.includes("1 to 12") ||
            cLower.includes("1-12") ||
            cLower.includes("1st to 12th") ||
            cLower.includes("1st to 10th") ||
            cLower.includes("k-12")
        ) {
            return true;
        }

        // 2. Direct equality or substring match
        if (cLower === selLower || cLower.includes(selLower) || selLower.includes(cLower)) {
            return true;
        }

        // 3. Pre-school / Nursery / LKG / UKG mapping
        if (
            (selLower.includes("lkg") || selLower.includes("ukg") || selLower.includes("nursery") || selLower.includes("pre-school")) &&
            (cLower.includes("pre-school") || cLower.includes("nursery") || cLower.includes("lkg") || cLower.includes("ukg") || cLower.includes("kg"))
        ) {
            return true;
        }

        // 4. Group Level mapping
        if (selNum !== null) {
            if (selNum >= 1 && selNum <= 5 && (cLower.includes("primary") || cLower.includes("class 1-5") || cLower.includes("1-5") || cLower.includes("1 to 5"))) return true;
            if (selNum >= 6 && selNum <= 8 && (cLower.includes("middle") || cLower.includes("class 6-8") || cLower.includes("6-8") || cLower.includes("6 to 8"))) return true;
            if (selNum >= 9 && selNum <= 10 && (cLower.includes("secondary") || cLower.includes("class 9-10") || cLower.includes("9-10") || cLower.includes("9 to 10") || cLower.includes("high school"))) return true;
            if (selNum >= 11 && selNum <= 12 && (cLower.includes("higher secondary") || cLower.includes("inter") || cLower.includes("class 11-12") || cLower.includes("11-12") || cLower.includes("+2"))) return true;

            // Numeric Range Parsing (e.g., "Class 1-10", "Class 5-12", "1 to 10")
            const rangeMatches = cLower.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
            if (rangeMatches) {
                const start = parseInt(rangeMatches[1], 10);
                const end = parseInt(rangeMatches[2], 10);
                if (selNum >= start && selNum <= end) return true;
            }

            // Single number extraction match
            const cNumMatch = cLower.match(/\d+/);
            if (cNumMatch && parseInt(cNumMatch[0], 10) === selNum) return true;
        }

        // Degree & Competitive Exams
        if (selLower.includes("degree") || selLower.includes("graduation")) {
            if (cLower.includes("degree") || cLower.includes("graduation") || cLower.includes("college") || cLower.includes("b.tech") || cLower.includes("b.sc")) return true;
        }
        if (selLower.includes("competitive") || selLower.includes("jee") || selLower.includes("neet") || selLower.includes("upsc")) {
            if (cLower.includes("competitive") || cLower.includes("entrance") || cLower.includes("jee") || cLower.includes("neet") || cLower.includes("exam")) return true;
        }

        return false;
    });
}

