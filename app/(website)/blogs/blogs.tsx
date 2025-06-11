"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
    id: string;
    title: string;
    description: string;
    media: {
        type: "image";
        url: string;
    };
    slug: string;
}

const blogs = [
    {
        id: "1",
        title: "How to Start Tarot Reading as a Beginner",
        description: "Learn the basics of tarot cards, choosing decks, and interpreting spreads.",
        media: {
            type: "image",
            url: "/uploads/tarot-beginners.jpg",
        },
        slug: "tarot-for-beginners",
    },
    {
        id: "2",
        title: "Top 5 Oracle Decks for Spiritual Growth",
        description: "Explore beautifully illustrated oracle decks that enhance your intuition.",
        media: {
            type: "image",
            url: "/uploads/oracle-decks.jpg",
        },
        slug: "oracle-decks-guide",
    },
    {
        id: "3",
        title: "Zodiac Love Compatibility Reading",
        description: "Which signs vibe best together? Here's what the cards and stars say.",
        media: {
            type: "image",
            url: "/uploads/zodiac-love.jpg",
        },
        slug: "zodiac-love-reading",
    },
];

const popularPosts = [
    {
        id: "1",
        title: "Best Tarot Spreads for 2025",
        excerpt:
            "Discover powerful spreads that offer clarity in love, career, and spiritual paths.",
        imageUrl: "/uploads/popular1.jpg",
        slug: "best-tarot-spreads-2025",
    },
    {
        id: "2",
        title: "How to Cleanse Your Deck",
        excerpt:
            "Learn simple rituals to cleanse and energize your tarot deck before readings.",
        imageUrl: "/uploads/popular2.jpg",
        slug: "cleanse-your-deck",
    },
    {
        id: "3",
        title: "Understanding The Major Arcana",
        excerpt:
            "A deep dive into the symbolism and meaning behind the Major Arcana cards.",
        imageUrl: "/uploads/popular3.jpg",
        slug: "major-arcana-guide",
    },
    {
        id: "4",
        title: "Tips for Accurate Tarot Readings",
        excerpt:
            "Enhance your readings with practical tips and mindfulness techniques.",
        imageUrl: "/uploads/popular4.jpg",
        slug: "accurate-tarot-tips",
    },
];
  

const Blogs = () => {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
            {/*Hero section */}
            <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('/images/blog-banner.png')] bg-cover bg-center bg-no-repeat" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
                        Our <span className="text-[var(--primary-gold)]">Blogs</span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
                        Step into the mystical world of <span className="font-bold">Card Readings</span> where every card drawn is a message from the universe just for you.
                    </p>

                </div> 
            </div>

            {/* Blogs Section */}
            <h1 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-10">
                🃏Blogs
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition"
                    >
                        <Image
                            src={blog.media.url}
                            alt={blog.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-[var(--primary-red)]">{blog.title}</h2>
                            <p className="text-sm mt-2 text-gray-600">{blog.description}</p>
                            <Link
                                href={`/blogs/${blog.slug}`}
                                className="text-[var(--primary-green)] font-semibold mt-3 inline-block"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {/* Popular Posts Section */}
            <h1 className="text-3xl font-bold text-center text-[var(--primary-red)] my-20">
                🔥 Popular Posts
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {popularPosts.map((post) => (
                    <div
                        key={post.id}
                        className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition cursor-pointer"
                    >
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-[var(--primary-red)]">{post.title}</h2>
                            <p className="text-sm mt-2 text-gray-600">{post.excerpt}</p>
                            <Link
                                href={`/blogs/${post.slug}`}
                                className="text-[var(--primary-green)] font-semibold mt-3 inline-block hover:underline"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
};

export default Blogs;
