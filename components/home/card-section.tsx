"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import "@/app/globals.css"; // optional, for global styles

const cards = [
    {
        id: 1,
        title: "The Fool",
        meaning: `The Fool is numbered 0, representing infinite potential. 
        The Fool carries only a small pack, showing a free spirit unburdened by past worries. 
        Trust the process and leap into the unknown, for adventure and growth await.`,
    },
    {
        id: 2,
        title: "The Magician",
        meaning: `The Magician, card number 1, symbolizes manifestation and potential. 
        With all elements at hand cup, wand, sword, and pentacle he reminds you that you have everything you need. Success comes through focus, intention, and action.`,
    },
    {
        id: 3,
        title: "The Lovers",
        meaning: `The Lovers card speaks of meaningful relationships, soulful connections, and important life choices. 
        This card asks you to make decisions that align with your values and true self. 
        It's about choosing love, not only in relationships but in every aspect of life.`,
    },
    {
        id: 4,
        title: "High Priestess",
        meaning: `The High Priestess is the guardian of the subconscious. 
        Tune in to dreams, signs, and inner whispers. It's a time for reflection rather than action.`,
    },
    {
        id: 5,
        title: "The Empress",
        meaning: `The Empress is the ultimate symbol of divine feminine energy. She is nurturing, abundant, and deeply connected to nature. 
        It’s a reminder to honor your body and cultivate joy.`,
    },
    {
        id: 6,
        title: "The Emperor",
        meaning: `The Emperor represents order, structure, and fatherly protection. 
         While stability is valuable, be mindful not to become too rigid or controlling.`,
    },
    {
        id: 7,
        title: "The Hierophant",
        meaning: `The Hierophant is the spiritual teacher, often linked with traditions, religion, and cultural values. 
        It can also indicate a time to examine your beliefs and seek deeper meaning in rituals or spiritual practices.`,
    },
    {
        id: 8,
        title: "The Chariot",
        meaning: `The Chariot is a card of motion, ambition, and triumph.  
        Whether it’s career, personal growth, or conflict, this card urges you to take the reins and charge ahead with confidence.`,
    },
    {
        id: 9,
        title: "Strength",
        meaning: `Strength is not about brute force but inner resilience. 
        This card reminds you that true courage lies in kindness and self-mastery. You’re being called to approach challenges with grace, integrity, and emotional balance.`,
    },
    {
        id: 10,
        title: "The Hermit",
        meaning: `The Hermit carries a lantern, guiding seekers on their inward path. 
         This card suggests a pause to reflect, meditate, and gain wisdom before the next stage of your journey unfolds.`,
    },
];
  
  

export default function TarotCardSection() {
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setFlippedCard((prev) => (prev === id ? null : id));
    };

    return (
            <div className="min-h-screen  p-8 flex flex-col items-center justify-center overflow-hidden mt-0">
                {/* Header */}
            <section className="relative py-12 px-6 text-center bg-gradient-to-br from-[var(--primary-gold)] via-white to-[var(--primary-red)] rounded-xl shadow-md mx-auto w-full max-w-7xl">
                {/* Optional Glow Orbs for Mystic Effect */}
                <motion.div
                    className="absolute w-32 h-32 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-2 left-4 z-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-24 h-24 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-4 right-6 z-0"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity }}
                />

                {/* Main Title */}
                <motion.h1
                    className="relative text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] mb-3 z-10"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Discover Your Destiny with Tarot
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    className="relative text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-4 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Step into a sacred space of intuition, insight, and revelation. The answers you seek are already within.
                </motion.p>
            </section>

            {/* Card Grid */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto mt-3">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="w-71 h-99 perspective cursor-pointer"
                        onClick={() => handleCardClick(card.id)}
                    >
                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flippedCard === card.id ? "rotate-y-180" : ""}`}>
                            {/* Front Side */}
                            <div
                                className="absolute w-full h-full rounded-xl shadow-lg [backface-visibility:hidden] border-4 border-white bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('/images/card-bg.jpg')",
                                }}
                            >
                            </div>


                            {/* Back Side */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-[var(--primary-gold)] via-white to-[var(--primary-red)] rounded-xl shadow-lg backface-hidden rotate-y-180 p-4 flex flex-col justify-center items-center border-4 border-[#cc9900]">
                                <h3 className="text-2xl font-bold mb-2 text-[var(--primary-red)]">{card.title}</h3>
                                <p className="text-l text-center text-gray-800">{card.meaning}</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
