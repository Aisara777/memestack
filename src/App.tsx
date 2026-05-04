import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Languages, ArrowLeft, ArrowRight } from 'lucide-react';

// ==========================================
// 🖼️ ADD YOUR OWN IMAGE URL OR PATH HERE
// Replace the string below with your image URL or local path (e.g., "/my-image.png" if placed in the public folder)
// ==========================================
const MEME_DATA = [
  {
    topTextEn: "Nooo don't turn 25",
    bottomTextEn: "you're so sexy aha",
    topTextRu: "Нееет, только не 25",
    bottomTextRu: "ты такая секси аха",
    image: "/leo.png",
  },
  {
    bottomTextEn: "Tastes good",
    bottomTextRu: "Вкусно",
    image: "/tore.jpg",
  },
   {
    bottomTextEn: "me waving to my neighbours dog",
    bottomTextRu: "я машу собаке соседей",
    image: "/sponge.jpg",
  },
   {
    topTextEn: "meo showing my friends my wallet ",
    bottomTextEn: "after hanging out with them",
    topTextRu: "я показываю своим друзьям свой кошелёк",
    bottomTextRu: "после того как потусовалась с ними",
    image: "/wallet.jpg",
  },
];

// Create a large array to simulate an infinite loop of your memes
const MEMES = Array.from({ length: 1000 }).map((_, i) => ({
  ...MEME_DATA[i % MEME_DATA.length],
  id: i,
}));

const Card = ({ meme, isFront, onSwipe, translated }: { meme: any, isFront: boolean, onSwipe: (dir: string) => void, translated: boolean }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(500);
      onSwipe('right');
    } else if (info.offset.x < -100) {
      setExitX(-500);
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center justify-between p-8 border border-gray-100 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: isFront ? 10 : 0 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{ scale: isFront ? 1 : 0.95, y: isFront ? 0 : 20, opacity: 1 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <h2 className="text-3xl font-bold text-center font-serif text-gray-900 leading-tight tracking-tight">
        {translated ? meme.topTextRu : meme.topTextEn}
      </h2>
      
      <div className="flex-1 w-full my-6 relative rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center pointer-events-none shadow-inner">
        <img 
          src={meme.image} 
          alt="Meme" 
          className="w-full h-full object-cover" 
          draggable={false} 
          referrerPolicy="no-referrer"
        />
      </div>
      
      <h2 className="text-3xl font-bold text-center font-serif text-gray-900 leading-tight tracking-tight">
        {translated ? meme.bottomTextRu : meme.bottomTextEn}
      </h2>
    </motion.div>
  );
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translated, setTranslated] = useState(false);

  const handleSwipe = (direction: string) => {
    setCurrentIndex((prev) => prev + 1);
    setTranslated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          MemeStack
        </h1>
        <p className="text-gray-500 font-medium">Swipe, translate, and enjoy!</p>
      </div>

      <div className="w-full max-w-sm h-[550px] relative perspective-1000">
        <AnimatePresence>
          {MEMES.slice(currentIndex, currentIndex + 2).reverse().map((meme, index) => (
            <Card 
              key={meme.id} 
              meme={meme} 
              isFront={index === 1} 
              onSwipe={handleSwipe}
              translated={translated}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 z-20">
        <button 
          onClick={() => setTranslated(!translated)}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:bg-gray-800 hover:scale-105 transition-all active:scale-95"
        >
          <Languages size={24} />
          {translated ? "Show Original" : "Translate to Russian"}
        </button>
        
        <div className="flex items-center gap-3 text-gray-400 text-sm font-semibold uppercase tracking-widest">
          <ArrowLeft size={16} />
          <span>Swipe Cards</span>
          <ArrowRight size={16} />
        </div>
      </div>
      
    </div>
  );
}
