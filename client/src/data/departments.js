// Departments and the courses each one offers.
// Keep in sync with server/data/departments.js (used by `npm run seed`).
export const DEPARTMENT_COURSES = {
    'SCHOOL OF COMPUTER STUDIES': ['B.Sc AI & ML', 'B.Sc Data Science', 'B.Sc Computer Science', 'BCA', 'B.Sc Information Technology', 'M.Sc Computer Science', 'MCA'],
    'ELECTRONICS': ['B.Sc Electronics & Communication', 'B.Sc Internet Of Things', 'M.Sc Applied Electronics'],
    'SCHOOL OF MANAGEMENT': ['BBA (Business Administration)', 'BBA (Computer Application)', 'BBA (Logistics)', 'MBA'],
    'SCHOOL OF COMMERCE': ['B.Com', 'B.Com (Computer Applications)', 'B.Com (Information Technology)', 'B.Com (Accounting and Finance)', 'B.Com (Professional Accounting)', 'B.Com (Business Analytics)', 'M.Com', 'M.Com (International Business)', 'M.Com (Computer Applications)'],
    'FOODS & NUTRITION': ['B.Sc Nutrition and Dietetics', 'M.Sc Foods & Nutrition'],
    'ENGLISH': ['B.A. English Literature', 'M.A. English Literature'],
    'BIOCHEMISTRY': ['B.Sc Biochemistry', 'M.Sc Biochemistry'],
    'BIOTECHNOLOGY': ['B.Sc Biotechnology', 'M.Sc Biotechnology'],
    'MICROBIOLOGY': ['B.Sc Microbiology', 'M.Sc Microbiology'],
    'MATHEMATICS': ['B.Sc Maths', 'M.Sc Maths'],
    'PSYCHOLOGY': ['B.Sc Psychology'],
    'CATERING SCIENCE AND HOTEL MANAGEMENT': ['B.Sc (CS and HM)'],
    'MASTER OF SOCIAL WORK': ['MSW'],
    'LANGUAGES': ['Tamil', 'Hindi', 'Malayalam', 'French'],
};

export const DEPARTMENTS = Object.keys(DEPARTMENT_COURSES);

const sameName = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

// Courses for a department: the standard list plus any extra course the
// admin added to the Seat Matrix for that department. Each entry carries
// the Seat Matrix record (if any) so seat counts can be shown.
export const coursesForDepartment = (department, seatMatrix = []) => {
    if (!department) return [];
    const standard = (DEPARTMENT_COURSES[department] || []).map((name) => ({
        name,
        record: seatMatrix.find((c) => sameName(c.name, name)) || null,
    }));
    const extra = seatMatrix
        .filter((c) => sameName(c.department, department) && !standard.some((s) => sameName(s.name, c.name)))
        .map((c) => ({ name: c.name, record: c }));
    return [...standard, ...extra];
};

export const seatsLeft = (record) =>
    record ? Math.max((record.totalSeats || 0) - (record.filledSeats || 0), 0) : null;
