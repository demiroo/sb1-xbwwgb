"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const words = {
  top: [
    { text: 'Aşk', size: 'text-2xl', gradient: 'from-rose-500 to-pink-500', slug: 'ask' },
    { text: 'Dostluk', size: 'text-xl', gradient: 'from-blue-500 to-cyan-500', slug: 'dostluk' },
    { text: 'Hayat', size: 'text-lg', gradient: 'from-emerald-500 to-teal-500', slug: 'hayat' },
    { text: 'Başarı', size: 'text-xl', gradient: 'from-yellow-500 to-amber-500', slug: 'basari' },
    { text: 'Atatürk', size: 'text-2xl', gradient: 'from-red-500 to-orange-500', slug: 'ataturk' },
    { text: 'Bilgelik', size: 'text-lg', gradient: 'from-violet-500 to-purple-500', slug: 'bilgelik' },
    { text: 'Mutluluk', size: 'text-xl', gradient: 'from-orange-500 to-amber-500', slug: 'mutluluk' },
    { text: 'Edebiyat', size: 'text-2xl', gradient: 'from-indigo-500 to-blue-500', slug: 'edebiyat' },
  ],
  bottom: [
    { text: 'Güven', size: 'text-xl', gradient: 'from-cyan-500 to-blue-500', slug: 'guven' },
    { text: 'İnanç', size: 'text-lg', gradient: 'from-purple-500 to-pink-500', slug: 'inanc' },
    { text: 'Cesaret', size: 'text-2xl', gradient: 'from-orange-500 to-amber-500', slug: 'cesaret' },
    { text: 'Hoşgörü', size: 'text-xl', gradient: 'from-teal-500 to-green-500', slug: 'hosgoru' },
    { text: 'Merhamet', size: 'text-lg', gradient: 'from-indigo-500 to-violet-500', slug: 'merhamet' },
    { text: 'Adalet', size: 'text-2xl', gradient: 'from-rose-500 to-red-500', slug: 'adalet' },
    { text: 'Saygı', size: 'text-xl', gradient: 'from-blue-500 to-indigo-500', slug: 'saygi' },
    { text: 'Sevgi', size: 'text-lg', gradient: 'from-emerald-500 to-cyan-500', slug: 'sevgi' },
  ],
};

interface AnimatedWordCloudProps {
  onCategorySelect: (category: string) => void;
}

interface WordButtonProps {
  word: {
    text: string;
    size: string;
    gradient: string;
    slug: string;
  };
  index: number;
  onSelect: (category: string) => void;
}

const WordButton = ({ word, index, onSelect }: WordButtonProps) => {
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
    controls.start({
      scale: 1.1,
      y: -8,
      transition: { duration: 0.3 }
    });
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    controls.start({
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1 }
      }}
      className={`
        ${word.size} font-bold
        relative
        bg-gradient-to-r ${word.gradient}
        bg-clip-text text-transparent
        cursor-pointer select-none
        transition-all duration-300
        hover:text-shadow-lg
        px-4
      `}
      whileHover={{ scale: 1.1 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={() => onSelect(word.slug)}
    >
      {word.text}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"
        />
      )}
    </motion.button>
  );
};

const ScrollingRow = ({ words, direction = 1, speed = 30, onSelect }: { 
  words: typeof words.top, 
  direction?: number,
  speed?: number,
  onSelect: (category: string) => void
}) => {
  return (
    <motion.div
      animate={{
        x: direction > 0 ? [-1000, 0] : [0, -1000],
      }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
      }}
      className="flex gap-8 px-4"
    >
      {[...words, ...words].map((word, index) => (
        <WordButton
          key={`${word.text}-${index}`}
          word={word}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
};

export function AnimatedWordCloud({ onCategorySelect }: AnimatedWordCloudProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-[160px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]">
        <div className="absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-background via-background/80 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-center gap-8">
          <div className="relative h-12 overflow-hidden">
            <ScrollingRow words={words.top} direction={-1} speed={25} onSelect={onCategorySelect} />
          </div>
          
          <div className="relative h-12 overflow-hidden">
            <ScrollingRow words={words.bottom} direction={1} speed={30} onSelect={onCategorySelect} />
          </div>
        </div>
      </div>
    </div>
  );
}