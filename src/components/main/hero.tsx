"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Heart,
  Gift,
  Trophy,
  Zap,
  Beer,
  Barcode,
  ShoppingCart,
  BarChart,
  Stethoscope,
  Coffee,
  Smartphone,
  Gamepad2,
  Music,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Share Your Voice And Shape The FMCG Future!";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const surveyIcons = [
    { Icon: Beer, delay: 0 },
    { Icon: Barcode, delay: 0.5 },
    { Icon: ShoppingCart, delay: 1 },
    { Icon: BarChart, delay: 1.5 },
    { Icon: Heart, delay: 2 },
    { Icon: Stethoscope, delay: 2.5 },
    { Icon: Coffee, delay: 3 },
    { Icon: Smartphone, delay: 3.5 },
    { Icon: Gamepad2, delay: 4 },
    { Icon: Music, delay: 4.5 },
    { Icon: Camera, delay: 5 },
  ];

  return (
    <section className="relative bg-gradient-to-br from-black via-slate-900 to-red-950 py-20 lg:py-32 overflow-hidden">
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 text-white text-sm font-medium border border-red-500/30"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Zap className="w-4 h-4 mr-2 text-red-400" />
              </motion.div>
              Join 50,000+ happy FMCG shapers! 🎉
            </motion.div>

            {/* Main Headline with Typewriter Effect */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance"
              variants={itemVariants}
            >
              <span className="text-transparent bg-gradient-to-r from-red-400 via-white to-red-300 bg-clip-text">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="text-red-400"
                >
                  |
                </motion.span>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl text-pretty leading-relaxed"
              variants={itemVariants}
            >
              Take fun surveys, share your opinions, and get rewarded! It's that
              simple.
              <span className="text-red-400 font-semibold">
                {" "}
                Your thoughts matter! 💭
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg text-white"
                  asChild
                >
                  <Link href="/research">
                    🚀 See Current Researches
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 bg-transparent border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all duration-300"
                  asChild
                >
                  <Link href="/about">🎬 See How It Works</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Floating Pattern with Lucide Icons */}
          <div className="relative h-full min-h-[600px] hidden lg:block">
            <div className="absolute inset-0">
              {/* Large Ellipse with Icons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="relative w-80 h-80"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {surveyIcons.slice(0, 6).map(({ Icon, delay }, index) => {
                    const angle = index * 60 * (Math.PI / 180);
                    const x = Math.cos(angle) * 140;
                    const y = Math.sin(angle) * 140;

                    return (
                      <motion.div
                        key={index}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          x: x - 12,
                          y: y - 12,
                        }}
                        animate={{
                          scale: [0.8, 1.4, 0.8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: delay,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon className="w-6 h-6 text-rose-600" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Medium Ellipse with Icons */}
              <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="relative w-60 h-60"
                  animate={{ rotate: [360, 0] }}
                  transition={{
                    duration: 25,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {surveyIcons.slice(6, 10).map(({ Icon, delay }, index) => {
                    const angle = index * 90 * (Math.PI / 180);
                    const x = Math.cos(angle) * 100;
                    const y = Math.sin(angle) * 100;

                    return (
                      <motion.div
                        key={index + 6}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          x: x - 10,
                          y: y - 10,
                        }}
                        animate={{
                          scale: [1, 1.6, 1],
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: delay,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon className="w-5 h-5 text-rose-600" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Small Ellipse with Icon */}
              <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="relative w-40 h-40"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [0.6, 1.2, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Camera className="w-4 h-4 text-rose-600" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Additional floating background elements for depth */}
              <motion.div
                className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-red-500/10 to-red-600/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -40, 0],
                  y: [0, 30, 0],
                }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
              />

              <motion.div
                className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-rose-400/15 to-slate-600/10 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  y: [0, -60, 0],
                }}
                transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Floating dots for additional ambiance */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${
                    i % 3 === 0
                      ? "w-2 h-2 bg-red-400/50"
                      : i % 3 === 1
                      ? "w-1.5 h-1.5 bg-red-300/40"
                      : "w-1 h-1 bg-white/30"
                  }`}
                  style={{
                    top: `${20 + ((i * 8) % 60)}%`,
                    right: `${10 + (i % 3) * 15}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, i % 2 === 0 ? 8 : -8, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 5 + i * 0.4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
