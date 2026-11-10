// Fees are calculated by the server when the application is created and
// stored on the Admission record. This helper reads them, with a fallback
// for older records created before fees were stored.

const ADMISSION_FEE = 5000;
const ONE_TIME_FEE = 10000;
const SEMESTER_FEE_MAP = {
    'computer science': 30000,
    commerce: 22000,
    electronics: 25000,
    maths: 22000,
    mathematics: 22000,
    language: 18000,
    'english literature': 22000,
    management: 60000,
    science: 25000,
};
const PG_KEYWORDS = ['master', 'm.sc', 'm.a', 'm.com', 'mba', 'mca', 'pg'];

const fallbackSemesterFee = (course = '', department = '') => {
    const combined = `${course} ${department}`.toLowerCase();
    if (PG_KEYWORDS.some((k) => combined.includes(k))) return 35000;
    for (const [key, fee] of Object.entries(SEMESTER_FEE_MAP)) {
        if (combined.includes(key)) return fee;
    }
    return 25000;
};

export const feesFor = (app) => {
    const admissionFee = Number(app?.admissionFees ?? ADMISSION_FEE);
    const oneTimeFee = Number(app?.oneTimeFees ?? ONE_TIME_FEE);
    const semesterFee = Number(app?.semesterFees) > 0
        ? Number(app.semesterFees)
        : fallbackSemesterFee(app?.course, app?.department);
    return { admissionFee, oneTimeFee, semesterFee, total: admissionFee + oneTimeFee + semesterFee };
};

export const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
