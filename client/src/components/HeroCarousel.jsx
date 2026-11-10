import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            url: "https://rvscas.ac.in/api/rvscasac_rvscas/FrontPageImage/527280738.jpg",
            badge: "WELCOME INTO THE TEMPLE OF LEARNING",
            heading: "Excellence in Research",
            subheading: "Fostering Innovation and Discovery"
        },
        {
            url: "https://rvscas.ac.in/api/rvscasac_rvscas/FrontPageImage/788072536.webp",
            badge: "WELCOME INTO THE TEMPLE OF LEARNING",
            heading: "Excellence in Research",
            subheading: "Fostering Innovation and Discovery"
        },
        {
            url: "https://rvscas.ac.in/api/rvscasac_rvscas/FrontPageImage/434486000.webp",
            badge: "WELCOME INTO THE TEMPLE OF LEARNING",
            heading: "Excellence in Research",
            subheading: "Fostering Innovation and Discovery"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleApplyClick = () => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/student/dashboard");
        } else {
            navigate("/student-login");
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image with Dark Gradient Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[4000ms] ease-linear"
                        style={{
                            backgroundImage: `url(${slide.url})`,
                            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        {/* More complex gradient for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-full flex items-center pt-[120px] md:pt-[170px]">
                        <div className="container mx-auto px-6 md:px-12">
                            <div className={`max-w-4xl transition-all duration-1000 ease-out ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}>
                                <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-sm font-bold tracking-[0.2em] text-white bg-primary rounded-sm shadow-lg animate-pulse border border-red-400/30">
                                    {slide.badge}
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                    {slide.heading}
                                </h1>
                                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-lg text-shadow-sm">
                                    {slide.subheading}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={handleApplyClick}
                                        className="px-10 py-4 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-2xl border-none cursor-pointer text-lg tracking-wide"
                                    >
                                        Apply Now
                                    </button>
                                    <Link
                                        to="/courses"
                                        className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-all transform hover:scale-105 active:scale-95 shadow-2xl no-underline inline-block text-lg tracking-wide text-center"
                                    >
                                        Explore Courses
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows - Hidden on mobile for cleaner look, or small */}
            <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 items-center justify-center rounded-full bg-black/20 text-white hover:bg-primary transition-all group border-none cursor-pointer backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <FaChevronLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 items-center justify-center rounded-full bg-black/20 text-white hover:bg-primary transition-all group border-none cursor-pointer backdrop-blur-sm"
                aria-label="Next slide"
            >
                <FaChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Pagination Dots - Moved up to accommodate ticker */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-500 rounded-full cursor-pointer border-none ${index === currentSlide ? 'w-12 h-2.5 bg-accent shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Scroll Indicator Micro-animation - Moved up */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 opacity-60 hidden md:block">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
            </div>

            {/* Announcement Ticker */}
            <div className="absolute bottom-0 left-0 w-full bg-primary/95 backdrop-blur-sm text-white z-40 h-[45px] md:h-[50px] flex items-center overflow-hidden border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            <span className="text-sm md:text-lg font-bold uppercase tracking-[0.1em] px-8 flex items-center gap-3">
                                <span className="text-accent">★</span>
                                Admission Open for 2026
                                <span className="text-accent text-xs">●</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroCarousel;
