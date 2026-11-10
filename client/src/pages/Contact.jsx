import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            toast.success('Your message has been sent successfully! We will get back to you soon.', {
                position: "top-center",
                autoClose: 3000,
            });
            setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary uppercase font-serif">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 uppercase tracking-tighter">Get in Touch</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-bold text-sm uppercase">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-bold text-sm uppercase">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-bold text-sm uppercase">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition h-32"
                                required
                            ></textarea>
                        </div>
                        <button className="bg-primary text-white border-2 border-primary px-8 py-3 rounded-xl font-bold hover:bg-secondary hover:border-secondary transition shadow-lg transform hover:-translate-y-1 w-full uppercase tracking-widest text-sm">
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            <strong className="block text-gray-900">Address:</strong>
                            123 College Avenue,<br />
                            Knowledge City, CA 90210
                        </p>
                        <p>
                            <strong className="block text-gray-900">Phone:</strong>
                            +1 (555) 123-4567
                        </p>
                        <p>
                            <strong className="block text-gray-900">Email:</strong>
                            admissions@smartcollege.edu
                        </p>
                        <p>
                            <strong className="block text-gray-900">Office Hours:</strong>
                            Mon - Fri: 9:00 AM - 5:00 PM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
