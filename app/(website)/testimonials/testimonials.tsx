"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface Testimonial {
    id: string;
    title: string;
    media: {
        type: "image" | "video";
        url: string;
    };
    createdOn: string;
}

const testimonials = [
    {
        id: "1",
        title: "Amazing tarot reading experience!",
        media: {
            type: "image",
            url: "/uploads/testimonial1.jpg",
        },
    },
    {
        id: "2",
        title: "3-card spread helped me find clarity.",
        media: {
            type: "video",
            url: "/uploads/testimonial2.mp4",
        },
    },
    {
        id: "3",
        title: "Highly recommended for spiritual guidance.",
        media: {
            type: "image",
            url: "/uploads/testimonial3.jpg",
        },
    },
];

const transformationStories = [
    {
        id: "ts1",
        name: "Riya Kapoor",
        spread: "Celtic Cross",
        rating: 5,
        testimonial:
            "I was in a toxic relationship, feeling lost and unsure. The Celtic Cross reading helped me understand emotional patterns I was repeating. With the guidance I received, I began therapy and within two months, I felt empowered, healed, and found clarity in my life.",
    },
    {
        id: "ts2",
        name: "Ankit Verma",
        spread: "3-Card Spread",
        rating: 4,
        testimonial:
            "I was struggling with a big career decision and felt completely stuck. The 3-Card Spread helped me recognize my true passion and let go of fear. That reading gave me the push I needed to enroll in a UX Design course—now I feel motivated and aligned every day.",
    },
    {
        id: "ts3",
        name: "Neha Singh",
        spread: "Yes/No Spread",
        rating: 5,
        testimonial:
            "Before moving abroad, I was anxious and second-guessing everything. The Yes/No Spread provided much-needed clarity and reassurance. It helped me trust the process—and now, I’ve settled in beautifully and feel more confident than ever.",
    },
];

const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
        <Star key={i} size={10} className="text-yellow-500 fill-yellow-400" />
    ));
};

const Testimonials = () => {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
            {/* Hero Section */}
            <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('/images/testimonial-banner.jpg')] bg-cover bg-center bg-no-repeat" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
                        Real Stories. <span className="text-[var(--primary-gold)]">Real Testimonials</span>
                    </h1>

                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
                        Real voices. Real experiences. Let our seekers share how Card Readings helped guide their path.
                    </p>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-10">🌟 Testimonials</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                        {t.media.type === "image" ? (
                            <Image
                                src={t.media.url}
                                alt={t.title}
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <video
                                controls
                                src={t.media.url}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-[var(--primary-red)]">{t.title}</h2>
                            
                    
                        </div>
                    </div>
                ))}
            </div>

            {/* Transformation Stories Section */}
            <div className="mt-24 bg-gradient-to-b from-white to-gray-100 py-16 px-4 md:px-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--primary-red)] mb-12">
                    🌟 How Tarot Changed Their Path 
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {transformationStories.map((story) => (
                        <div
                            key={story.id}
                            className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 w-full max-w-md min-h-[420px] mx-auto"
                        >
                      
                            {/* Top name and spread */}
                            <div className="flex items-center gap-7 mb-10">
                                <div>
                                    <h3 className="font-semibold text-2xl  mt-4 mb-3 text-[#73CDA7]">{story.name}</h3>
                                    <p className="text-xs text-black-500 font-bold">Tarot Spread: {story.spread}</p>
                                    <div className="flex items-center gap-2 mb-2 mt-2">
                                        {renderStars(story.rating)}
                                    </div>
                                </div>
                            </div>

                            {/* Story content */}
                            <div className="space-y-3 text-[15px] leading-relaxed text-gray-700 mt-6 mb-4">
                                <p>{story.testimonial}</p>
                            </div>

                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--primary-gold)] to-[var(--primary-green)] rounded-b-2xl" />
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};


export default Testimonials;
