'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Users, Globe, Lightbulb, ShieldCheck, Heart, CheckCircle,
  Eye, Star, Moon, Sun, Sparkles
} from 'lucide-react';


const services = [
  {
    icon: <Moon className="w-9 h-9 text-[var(--primary-red)]" />,
    title: "Love & Relationship Reading",
    desc: "Understand your love life, soulmate energy, and relationship patterns with in-depth guidance.",
  },
  {
    icon: <Star className="w-9 h-9 text-[var(--primary-gold)]" />,
    title: "Career & Finance Reading",
    desc: "Find direction in your professional path and gain clarity on financial decisions.",
  },
  {
    icon: <Sun className="w-9 h-9 text-[var(--primary-yellow)]" />,
    title: "Life Purpose & Spiritual Path",
    desc: "Explore your soul's journey and receive insights to align your life purpose.",
  },
  {
    icon: <Globe className="w-9 h-9 text-[var(--primary-gold)]" />,
    title: "Online Tarot Sessions",
    desc: "Connect with our certified readers via video or chat from anywhere in the world.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 🌟 About Acharya Shilpa Sethi */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/about-banner.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            ✨ About <span className="text-[var(--primary-gold)]">Acharya Shilpa Sethi</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Intuitive Tarot Reader | Reiki Healer | Numerologist<br />
            Guiding Souls Since 2008
          </p>
        </div>
      </div>


      {/* ✨ About Shilpa Sethi with Glow */}
      <section className="relative py-10 px-6 bg-gradient-to-br from-[var(--primary-gold)] via-white to-[var(--primary-red)] rounded-xl shadow-md mx-auto w-full max-w-7xl overflow-hidden">
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

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* 📸 Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <Image
              src="/about.jpg"
              alt="About Acharya Shilpa Sethi"
              className="rounded-3xl shadow-2xl object-cover w-full max-w-lg h-[420px] md:h-[500px] border-4 border-[var(--primary-gold)] bg-white -ml-20"
              width={300}
              height={300}
            />
          </motion.div>

          

          {/* 🧘 Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 -ml-20 space-y-6"
          >
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] -mt-2 ">
              Your Journey to Clarity Starts Here
            </h2>

            <p className="text-lg text-gray-800 leading-relaxed mt-10 text-xl">
              I’m <span className="text-[var(--primary-red)] font-bold">Acharya Shilpa Sethi</span> — a devoted spiritual guide and healer. I offer transformative experiences through the sacred sciences of Tarot, Reiki, and Numerology.
              Over the years, I’ve had the honor of guiding thousands through life’s transitions.
            </p>

            <div className="border-l-4 border-[var(--primary-gold)] pl-4 italic text-[var(--primary-red)] font-medium bg-[var(--primary-gold)]/10 rounded-md mt-10 leading-relaxed text-xl">
              “Since 2008, I’ve walked the path of spiritual service — blending ancient metaphysical wisdom with divine intuition to help others align with their true essence.”
            </div>

          </motion.div>

        </div>
      </section>

      {/* 🌌 Soulful Journey Section */}
      <section className="w-full max-w-7xl mx-auto my-20 px-6">
        <div className="bg-gradient-to-r from-[var(--primary-gold)] via-white to-[var(--primary-red)] rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">

          {/* Glow Background Effects */}
          <motion.div
            className="absolute w-24 h-24 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-6 left-6 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-32 h-32 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-6 right-8 z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          {/* ✨ Content first, then image */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 space-y-5 relative z-10"
          >
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-gold)] bg-clip-text text-transparent -mt-40">
              A Soulful Journey of Awakening
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              My work is more than just readings — it’s a soulful journey. Together, we’ll release energetic blocks, connect to your higher self, and restore your spiritual balance.
            </p>
            <p className="border-l-4 border-[var(--primary-gold)] pl-4 italic text-[var(--primary-red)] font-medium bg-[var(--primary-gold)]/10 rounded-md mt-10 leading-relaxed text-xl">
              Over the years, I’ve had the honor of guiding thousands through life’s transitions. Whether you seek clarity, healing, or awakening, my mission is to empower your path with insight, energy, and confidence.
            </p>
          </motion.div>

          {/* 🎴 Image on the right, reduced height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative z-10"
          >
            <Image
              src="/images/soulful-journey.jpg"
              alt="Soulful Journey"
              width={400}
              height={300}
              className="rounded-2xl shadow-lg border-4 border-[var(--primary-gold)] object-cover w-[900px] h-[580px]"
            />
          </motion.div>
        </div>
      </section>



      {/* 💫 Services */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-extrabold text-center mb-14 text-[var(--primary-red)]">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition border-2 border-[var(--primary-gold)]/40">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--primary-green)]">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🙌 CTA Booking */}
      <section className="w-full max-w-7xl mx-auto my-16 px-4">
        <div className="rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-lg bg-[#fdf3e7]">
          <div className="flex-1 flex flex-col justify-center p-12">
            <span className="uppercase text-2xl font-bold text-[var(--primary-gold)] mb-2">Book A Reading</span>
            <h2 className="text-4xl font-extrabold mb-2 text-[var(--primary-green)]">Let the Divine Guide You</h2>
            <p className="text-lg mb-6 text-[#222]">Connect with Shilpa Sethi for a personalized and healing session today.</p>
          </div>
          <form className="flex-1 flex flex-col justify-center gap-3 p-12">
            <input type="text" placeholder="Your Name" className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none" />
            <input type="email" placeholder="Your Email" className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none" />
            <input type="text" placeholder="Your Question or Concern" className="px-4 py-3 rounded border border-[var(--primary-green)] focus:outline-none" />
            <button type="submit" className="w-full bg-[var(--primary-red)] text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-[#e74d3cdc] transition-colors mt-2">
              Book Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default About;