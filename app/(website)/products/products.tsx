"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const products = [
  {
    image: "/images/love-reading.jpg",
    name: "Love & Relationship Reading",
    price: "₹799",
    desc: "Gain deep insight into your love life, soulmate connections, and relationship patterns.",
  },
  {
    image: "/images/career-reading.jpg",
    name: "Career & Finance Reading",
    price: "₹999",
    desc: "Uncover guidance around your career path, financial decisions, and long-term goals.",
  },
  {
    image: "/images/life-purpose.jpg",
    name: "Life Purpose Reading",
    price: "₹899",
    desc: "Discover your soul’s journey and align your actions with your true purpose.",
  },
  {
    image: "/images/spiritual-reading.jpg",
    name: "Spiritual Awakening Reading",
    price: "₹1,099",
    desc: "Explore your spiritual path and receive messages from your higher self or spirit guides.",
  },
  {
    image: "/images/yearly-reading.jpg",
    name: "Year Ahead Spread",
    price: "₹1,499",
    desc: "A month-by-month tarot forecast to guide your year with clarity and confidence.",
  },
  {
    image: "/images/mini-reading.jpg",
    name: "3-Card Mini Reading",
    price: "₹499",
    desc: "Perfect for quick guidance on love, career, or life. Clear and to the point.",
  },
];
const recommendedProducts = [
  {
    id: "1",
    image: "/images/rider-waite.jpg",
    name: "Rider-Waite Tarot Deck",
    price: "₹1,299",
    desc: "Classic and widely-used tarot deck, perfect for beginners and pros alike.",
    buyLink: "https://yourstore.com/products/rider-waite-tarot",
  },
  {
    id: "2",
    image: "/images/oracle-cards.jpg",
    name: "Oracle Cards: Divine Messages",
    price: "₹999",
    desc: "Beautifully illustrated oracle cards for daily guidance and inspiration.",
    buyLink: "https://yourstore.com/products/oracle-cards-divine",
  },
  {
    id: "3",
    image: "/images/tarot-cloth-bag.jpg",
    name: "Tarot Cloth & Bag Set",
    price: "₹699",
    desc: "Elegant cloth and pouch set to protect and enhance your reading ritual.",
    buyLink: "https://yourstore.com/products/tarot-cloth-bag-set",
  },
  {
    id: "4",
    image: "/images/sage-bundle.jpg",
    name: "Cleansing Sage Bundle",
    price: "₹499",
    desc: "All-natural sage for cleansing your space and tarot decks from negative energies.",
    buyLink: "https://yourstore.com/products/cleansing-sage-bundle",
  },
];

const whatsappNumber = "+919871776559";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/product-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[var(--primary-gold)]">Products</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Explore our most-loved tarot readings. Handpicked spreads, powerful insights, and guidance you'll never forget!
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.name} className="overflow-hidden shadow-xl border-[#e3061320] flex flex-col bg-white/95">
              <div className="relative w-full h-48">
                <Image src={product.image || ""} alt={product.name} fill className="object-cover" />
              </div>
              <CardHeader className="pt-5">
                <CardTitle className="text-xl font-bold text-[var(--primary-red)] flex flex-col gap-1">
                  {product.name}
                  <span className="text-lg font-extrabold text-[var(--primary-green)]">{product.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <p className="text-gray-700 font-medium text-[15px] mb-4">{product.desc}</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in buying the "${encodeURIComponent(
                    product.name
                  )}" tarot reading.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-center bg-[var(--primary-red)] hover:bg-[var(--primary-green)] text-black font-bold py-2 px-4 rounded-xl transition"
                >
                  Buy Now
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-[var(--primary-red)]">
          🔥 Shop / Recommended Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-xl border-[#e3061320] flex flex-col bg-white/95"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image || ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pt-5">
                <CardTitle className="text-xl font-bold text-[var(--primary-red)] flex flex-col gap-1">
                  {product.name}
                  <span className="text-lg font-extrabold text-[var(--primary-green)]">
                    {product.price}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <p className="text-gray-700 font-medium text-[15px] mb-4">{product.desc}</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in buying the "${encodeURIComponent(
                    product.name
                  )}" tarot reading.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-center bg-[var(--primary-red)] hover:bg-[var(--primary-green)] text-black font-bold py-2 px-4 rounded-xl transition"
                >
                  Buy Now
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductsPage;
