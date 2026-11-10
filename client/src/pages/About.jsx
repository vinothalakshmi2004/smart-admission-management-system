import React from 'react';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16 about-page">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 text-primary uppercase font-serif tracking-tight">
        About RVS College of Arts and Science
      </h1>

      {/* History */}
      <div className="bg-white p-5 sm:p-8 rounded-lg shadow-md mb-10">
        <h2 className="section-title">Our History</h2>
        <p className="section-text">
          Established in 1986, RVS College of Arts and Science is a reputed institution
          committed to providing quality higher education. The college has consistently
          focused on academic excellence, character building, and holistic student development.
        </p>
        <p className="section-text">
          Affiliated to a recognized university and approved by relevant authorities,
          the college offers a wide range of undergraduate and postgraduate programs in
          Arts, Science, Commerce, and Computer Applications.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="info-card">
          <h2 className="section-title">Our Vision</h2>
          <p className="section-text">
            To emerge as a centre of excellence in Arts and Science education by nurturing
            knowledgeable, skilled, and socially responsible graduates.
          </p>
        </div>

        <div className="info-card">
          <h2 className="section-title">Our Mission</h2>
          <ul className="list-disc list-inside section-text space-y-2">
            <li>Deliver quality education through innovative teaching methods.</li>
            <li>Encourage critical thinking, creativity, and research culture.</li>
            <li>Enhance employability through skill-based training.</li>
            <li>Instill ethical values and social commitment.</li>
          </ul>
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white p-5 sm:p-8 rounded-lg shadow-md mb-10">
        <h2 className="section-title">Campus & Facilities</h2>
        <p className="section-text">
          RVS College of Arts and Science provides a student-friendly campus with modern infrastructure
          including smart classrooms, well-equipped laboratories, a digital library,
          seminar halls, and sports facilities.
        </p>
        <ul className="list-disc list-inside section-text space-y-2 mt-4">
          <li>Well-stocked Library with e-resources</li>
          <li>Computer Labs with high-speed internet</li>
          <li>Career Guidance & Placement Cell</li>
          <li>NSS, NCC, and Extension Activities</li>
        </ul>
      </div>

      {/* Why Choose Us */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="feature-card text-center font-bold uppercase tracking-tight">Experienced & Qualified Faculty</div>
        <div className="feature-card text-center font-bold uppercase tracking-tight">Industry-Oriented Curriculum</div>
        <div className="feature-card text-center font-bold uppercase tracking-tight">Strong Alumni Network</div>
      </div>

      {/* Location Section */}
      <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn group">
        <div className="flex items-center gap-6">
          <div className="bg-primary/10 p-5 rounded-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
            <FaMapMarkerAlt className="text-2xl md:text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic font-serif">
              Our <span className="text-primary not-italic tracking-normal">Location</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
              RVS COLLEGE OF ARTS AND SCIENCE, SULUR, COIMBATORE
            </p>
          </div>
        </div>

        <a
          href="https://maps.app.goo.gl/KnWjBE3f41ap3fBi6"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white px-5 sm:px-8 md:px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 shadow-xl active:scale-95 group/btn"
        >
          View on Google Maps
          <FaExternalLinkAlt className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default About;
