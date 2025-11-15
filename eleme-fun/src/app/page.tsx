'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import FoodJoke from '@/components/FoodJoke';
import FoodFact from '@/components/FoodFact';
import FoodWheel from '@/components/FoodWheel';
import FictionalMenu from '@/components/FictionalMenu';
import CommentSection from '@/components/CommentSection';
import EasterEgg from '@/components/EasterEgg';
import { Utensils, Sparkles, Heart, Star } from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full apple-gradient opacity-20 blur-3xl"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-15 blur-3xl"
          style={{
            right: `${mousePosition.x * 0.03}px`,
            bottom: `${mousePosition.y * 0.03}px`,
          }}
        />
      </div>

      {/* 装饰性元素 - 使用固定值避免hydration不匹配 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3 + (i * 0.1) % 2,
              repeat: Infinity,
              delay: (i * 0.1) % 2
            }}
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 73) % 100}%`,
            }}
          >
            {i % 3 === 0 && <Sparkles className="w-4 h-4 text-purple-400" />}
            {i % 3 === 1 && <Heart className="w-3 h-3 text-pink-400" />}
            {i % 3 === 2 && <Star className="w-3 h-3 text-yellow-400" />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* 头部标题区域 */}
        <motion.header 
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full apple-gradient mb-6 animate-pulse-glow"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Utensils className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            饿了么美食娱乐
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            发现美食的乐趣，享受生活的味道 ✨
          </motion.p>
        </motion.header>

        {/* 主要内容网格 */}
        <main className="container mx-auto px-4 pb-20">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.2 }}
          >
            {/* 美食段子 */}
            <motion.div 
              className="card-hover"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FoodJoke />
            </motion.div>

            {/* 美食冷知识 */}
            <motion.div 
              className="card-hover"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FoodFact />
            </motion.div>

            {/* 吃啥大转盘 */}
            <motion.div 
              className="card-hover lg:col-span-2"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FoodWheel />
            </motion.div>

            {/* 今日虚构菜单 */}
            <motion.div 
              className="card-hover lg:col-span-2"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FictionalMenu />
            </motion.div>

            {/* 评论区 */}
            <motion.div 
              className="card-hover lg:col-span-2"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CommentSection />
            </motion.div>
          </motion.div>
        </main>

        {/* 神秘彩蛋按钮 */}
        <EasterEgg />

        {/* 底部装饰 */}
        <motion.footer 
          className="text-center py-12 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-lg">用心制作，用爱分享</span>
            <Heart className="w-5 h-5 text-red-400" />
          </motion.div>
          <p className="text-sm">© 2024 饿了么美食娱乐 - 让每一餐都充满惊喜</p>
          <motion.div
            className="mt-4 flex justify-center space-x-4 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI 驱动</span>
            </span>
            <span className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>精美设计</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>用心制作</span>
            </span>
          </motion.div>
        </motion.footer>
      </div>
    </div>
  );
}
