"use client";

import React from "react";
import { Star } from "lucide-react";

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
      "Before moving abroad, I was anxious and second-guessing everything. The Yes/No Spread provided much-needed clarity and reassurance. It helped me trust the process and now, I’ve settled in beautifully and feel more confident than ever.",
  },
];

// Helper to render star icons
const renderStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => (
    <Star key={i} className="w-5 h-5 text-[var(--primary-gold)] fill-[var(--primary-gold)]" />
  ));
};

const TestimonialSection = () => {
  return (
    <section className="mt-15 bg-gradient-to-b from-[var(--primary-gold)] via-white to-[var(--primary-red)] py-16 px-4 md:px-10 rounded-xl shadow-md max-w-7xl mx-auto overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--primary-red)] mb-12">
        🌟 How Tarot Changed Their Path
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {transformationStories.map((story) => (
          <div
            key={story.id}
            className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 w-full max-w-md min-h-[420px] mx-auto"
          >
            {/* Top Section */}
            <div className="flex items-center gap-7 mb-10">
              <div>
                <h3 className="font-semibold text-2xl text-[var(--primary-green)] mb-1">
                  {story.name}
                </h3>
                <p className="text-xs text-black font-bold mb-1">Tarot Spread: {story.spread}</p>
                <div className="flex items-center gap-1">{renderStars(story.rating)}</div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-[15px] leading-relaxed text-gray-700 mt-2 mb-4">
              <p>{story.testimonial}</p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
