import React, { useState } from 'react';
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaWpforms, FaUserGraduate, FaTrophy, FaHandHoldingUsd, FaArrowRight } from 'react-icons/fa';

const ScholarshipChecker = () => {
    const [showForm, setShowForm] = useState(false);
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState({
        community: '',
        income: '',
        marks: '',
        firstGraduate: 'No',
        sportsQuota: 'No'
    });

    const checkEligibility = (e) => {
        e.preventDefault();
        const eligible = [];

        // Merit Scholarship
        if (Number(formData.marks) >= 85) {
            eligible.push({
                name: "Merit Scholarship",
                desc: "Granted for exceptional academic performance (85% and above).",
                icon: <FaGraduationCap />
            });
        }

        // First Graduate Scholarship
        if (formData.firstGraduate === 'Yes') {
            eligible.push({
                name: "First Graduate Scholarship",
                desc: "Support for students who are the first in their family to pursue a degree.",
                icon: <FaUserGraduate />
            });
        }

        // Community Scholarship
        if (['SC', 'ST', 'BC', 'MBC'].includes(formData.community)) {
            eligible.push({
                name: "Community Scholarship",
                desc: `Reserved for students belonging to the ${formData.community} community.`,
                icon: <FaHandHoldingUsd />
            });
        }

        // Sports Scholarship
        if (formData.sportsQuota === 'Yes') {
            eligible.push({
                name: "Sports Scholarship",
                desc: "Awarded to active student-athletes with proven track records.",
                icon: <FaTrophy />
            });
        }

        setResults(eligible);
        setShowForm(false);
    };

    const resetChecker = () => {
        setResults(null);
        setShowForm(true);
        setFormData({
            community: '',
            income: '',
            marks: '',
            firstGraduate: 'No',
            sportsQuota: 'No'
        });
    };

    return (
        <div className="mb-12 animate-fadeIn">
            {/* main section card */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group mb-4">
                <div className="flex items-center gap-6">
                    <div className="bg-secondary/10 p-5 rounded-3xl group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg">
                        <FaHandHoldingUsd className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic font-serif">
                            Scholarship <span className="text-secondary not-italic tracking-normal">Eligibility</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">
                            Analyze your profile for institutional financial aid
                        </p>
                    </div>
                </div>

                {!showForm && !results && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 shadow-xl active:scale-95 group/btn cursor-pointer border-none"
                    >
                        Check Eligibility
                    </button>
                )}
            </div>

            {/* Form Modal/Section */}
            {showForm && (
                <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 animate-slideUp">
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                        <FaWpforms className="text-secondary text-2xl" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Eligibility Criteria Form</h3>
                    </div>

                    <form onSubmit={checkEligibility} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">01. Community Membership</label>
                            <select
                                value={formData.community}
                                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-secondary transition-all font-black text-gray-700"
                            >
                                <option value="">Select Community</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="BC">BC</option>
                                <option value="MBC">MBC</option>
                                <option value="OC">OC</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">02. Annual Family Income</label>
                            <input
                                type="number"
                                placeholder="E.G. 250000"
                                value={formData.income}
                                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-secondary transition-all font-black text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">03. 12th Marks Percentage</label>
                            <input
                                type="number"
                                placeholder="E.G. 85"
                                value={formData.marks}
                                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                required
                                min="0" max="100"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-secondary transition-all font-black text-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">04. First Graduate</label>
                                <select
                                    value={formData.firstGraduate}
                                    onChange={(e) => setFormData({ ...formData, firstGraduate: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-secondary transition-all font-black text-gray-700"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">05. Sports Quota</label>
                                <select
                                    value={formData.sportsQuota}
                                    onChange={(e) => setFormData({ ...formData, sportsQuota: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-secondary transition-all font-black text-gray-700"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all border-none cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-secondary/20 hover:bg-gray-900 transition-all active:scale-95 border-none cursor-pointer flex items-center gap-2"
                            >
                                Evaluate Profile <FaArrowRight />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Results Display */}
            {results && (
                <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 animate-slideUp">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="text-green-500 text-2xl" />
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Eligibility Results</h3>
                        </div>
                        <button
                            onClick={resetChecker}
                            className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] border-2 border-secondary/20 px-4 py-2 rounded-full hover:bg-secondary hover:text-white transition-all cursor-pointer bg-transparent"
                        >
                            Re-Check Eligibility
                        </button>
                    </div>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((scholarship, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-[30px] border border-gray-100 flex items-start gap-4 transform transition-all hover:scale-105">
                                    <div className="bg-secondary/10 p-3 rounded-xl text-secondary text-xl">
                                        {scholarship.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-800 uppercase text-xs tracking-tight mb-1">{scholarship.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold leading-tight">{scholarship.desc}</p>
                                        <div className="mt-3 inline-flex items-center gap-1 text-green-500 font-black text-[9px] uppercase tracking-widest">
                                            <FaCheckCircle /> Eligible
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <FaTimesCircle className="text-red-500 text-6xl mb-4 opacity-20" />
                            <h4 className="text-2xl font-black text-gray-400 uppercase italic">No Scholarships Available</h4>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 px-12 leading-relaxed">Your current profile does not meet our institutional scholarship criteria at this moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScholarshipChecker;
