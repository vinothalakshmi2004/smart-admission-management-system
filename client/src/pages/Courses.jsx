import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/courses");
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-primary font-black uppercase text-[10px] tracking-widest">Compiling Prospectus...</p>
      </div>
    );
  }

  // Helper to categorize courses if needed (grouped by duration or keyword)
  const ugCourses = courses.filter(c => c.duration?.includes('Years'));
  const pgCourses = courses.filter(c => c.duration?.includes('2 Years') || c.name?.includes('M.') || c.name?.includes('MBA') || c.name?.includes('MCA'));

  const renderCourseCard = (course) => {
    const filled = course.filledSeats || 0;
    const total = course.totalSeats || 60;
    const available = total - filled;
    const percent = Math.min((filled / total) * 100, 100);
    const isLow = available > 0 && available <= 5;

    return (
      <div key={course._id} className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
        {/* Decorative Indicator */}
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform group-hover:scale-150 duration-700 ${percent > 80 ? 'bg-red-500' : 'bg-primary'}`}></div>

        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
              <FaUserGraduate className="text-xl" />
            </div>
            {isLow && (
              <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider animate-bounce">
                <FaExclamationTriangle /> Urgent: {available} Left
              </span>
            )}
            {available === 0 && (
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider italic">
                Waitlist Only
              </span>
            )}
          </div>

          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors leading-tight">
            {course.name}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center mb-6">
            <FaClock className="mr-2" /> {course.duration} Program
          </p>

          <div className="bg-neutralLight/50 p-6 rounded-[24px] border border-gray-50 mb-6">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Admission Matrix</p>
                <p className="text-lg font-black text-gray-800 tracking-tighter leading-none">
                  {filled} <span className="text-gray-300 mx-1">/</span> {total}
                </p>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${percent > 80 ? 'text-red-500' : 'text-primary'}`}>
                {Math.round(percent)}% Filled
              </p>
            </div>

            <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner flex">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${percent > 90 ? 'bg-red-600' : percent > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button className="w-full py-4 rounded-2xl bg-gray-900 group-hover:bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl border-none cursor-pointer">
          Apply for 2026-27
        </button>
      </div>
    );
  };

  return (
    <div className="bg-neutralLight min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-20 text-center">
          <div className="inline-block bg-primary/5 px-6 py-2 rounded-full border border-primary/10 mb-6 group">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live Academic Enrollment Status
            </p>
          </div>
          <h1 className="text-6xl font-black text-gray-800 uppercase tracking-tighter mb-4 italic font-serif leading-none">
            Choose Your <span className="text-primary font-sans not-italic tracking-normal">Future</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto italic opacity-70">
            Real-time seat availability track system for optimal career planning.
          </p>
        </header>

        {/* Dynamic Categories */}
        <div className="space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-200">
              <div className="h-8 w-1.5 bg-primary"></div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">Flagship <span className="text-primary tracking-normal">Programs</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => renderCourseCard(course))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Courses;

