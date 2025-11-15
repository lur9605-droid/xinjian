'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Lightbulb, Sparkles, Heart, Share2, Copy, AlertCircle, BookOpen } from 'lucide-react';
import { generateFoodFact } from '@/lib/kimi-api';

export default function FoodFact() {
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [factCount, setFactCount] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);

  useEffect(() => {
    generateFact();
  }, []);

  const generateFact = async () => {
    setLoading(true);
    setError('');
    setLiked(false);
    try {
      const newFact = await generateFoodFact();
      setFact(newFact);
      setFactCount(prev => prev + 1);
      setKnowledgeLevel(prev => Math.min(prev + 1, 100));
      
      // 每3个知识触发一次特效
      if ((factCount + 1) % 3 === 0) {
        triggerKnowledgeEffect();
      }
    } catch (err) {
      setError('获取美食冷知识失败，请稍后重试');
      // 备用冷知识
      const backupFacts = [
        '蜂蜜永远不会变质，考古学家在埃及金字塔中发现了3000年前的蜂蜜，仍然可以食用。',
        '香蕉实际上是浆果，而草莓却不是。',
        '苹果比咖啡更能提神，因为它含有更多的天然糖分和维生素。',
        '世界上最辣的辣椒是卡罗莱纳死神辣椒，它的辣度可以达到220万史高维尔单位。',
        '巧克力含有一种叫做苯乙胺的化学物质，这种物质能够让人产生恋爱的感觉。',
        '菠萝含有一种叫做菠萝蛋白酶的酶，这种酶可以分解蛋白质，所以吃菠萝时会有刺痛感。',
        '胡萝卜最初是紫色的，后来经过培育才变成了橙色。',
        '咖啡最初是被山羊发现的，牧羊人发现山羊吃了咖啡果后变得异常兴奋。',
        '番茄最初被认为是有毒的，因为它们是茄科植物。',
        '世界上有超过1000种不同的苹果品种。',
        '生姜可以帮助缓解恶心和呕吐，是一种天然的止吐药。',
        '大蒜具有抗菌和抗病毒的特性，被称为天然的抗生素。',
        '柠檬含有大量的维生素C，可以帮助增强免疫系统。',
        '牛油果含有健康的单不饱和脂肪，有助于降低胆固醇。',
        '蓝莓含有抗氧化剂，可以帮助保护大脑免受氧化应激的损害。'
      ];
      setFact(backupFacts[Math.floor(Math.random() * backupFacts.length)]);
    } finally {
      setLoading(false);
    }
  };

  const triggerKnowledgeEffect = () => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setKnowledgeLevel(prev => Math.min(prev + 5, 100));
      createKnowledgeSparkle();
    }
  };

  const createKnowledgeSparkle = () => {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.className = 'absolute pointer-events-none text-xl animate-sparkle-float';
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    sparkle.style.transform = 'translate(-50%, -50%)';
    sparkle.style.zIndex = '1000';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fact);
      setCopied(true);
      setKnowledgeLevel(prev => Math.min(prev + 2, 100));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = fact;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '美食冷知识',
          text: fact,
          url: window.location.href,
        });
        setKnowledgeLevel(prev => Math.min(prev + 3, 100));
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 降级到复制
      handleCopy();
    }
  };

  const getKnowledgeLevelColor = () => {
    if (knowledgeLevel < 30) return 'text-red-400';
    if (knowledgeLevel < 60) return 'text-yellow-400';
    if (knowledgeLevel < 90) return 'text-blue-400';
    return 'text-green-400';
  };

  const getKnowledgeLevelLabel = () => {
    if (knowledgeLevel < 30) return '知识新手';
    if (knowledgeLevel < 60) return '知识学徒';
    if (knowledgeLevel < 90) return '知识达人';
    return '知识大师';
  };

  return (
    <div 
      className="glass-morphism rounded-2xl p-6 h-full relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 装饰性背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-4 right-4 text-yellow-400 opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Lightbulb className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-blue-400 opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <BookOpen className="w-6 h-6" />
        </motion.div>
      </div>

      {/* 知识等级进度条 */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {getKnowledgeLevelLabel()}
          </span>
          <span className={`text-xs font-bold ${getKnowledgeLevelColor()}`}>
            {knowledgeLevel}/100
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400`}
            initial={{ width: 0 }}
            animate={{ width: `${knowledgeLevel}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* 特效粒子 - 使用固定值避免hydration不匹配 */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              initial={{ 
                x: (i * 53) % 100 + '%',
                y: (i * 67) % 100 + '%',
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
                rotate: (i * 47) % 360
              }}
              transition={{ 
                duration: (i * 0.07) % 1.5 + 0.5,
                delay: (i * 0.03) % 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            美食冷知识
          </h2>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleLike}
              className={`p-2 rounded-full transition-all duration-300 ${
                liked 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-red-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              onClick={handleCopy}
              className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
            >
              <Copy className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-green-400 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={generateFact}
              disabled={loading}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* 知识计数器 */}
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
            第 {factCount} 个冷知识 {liked && '❤️'}
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center py-8"
            >
              <div className="flex flex-col items-center space-y-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Lightbulb className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <p className="text-white/60">AI正在挖掘知识...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={fact}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="py-4"
            >
              <div className="relative">
                <motion.div
                  className="absolute -left-2 -top-2 text-yellow-400 opacity-50"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Lightbulb className="w-4 h-4" />
                </motion.div>
                <p className="text-white/90 text-lg leading-relaxed pl-4">
                  {fact}
                </p>
                <motion.div
                  className="absolute -right-2 -bottom-2 text-blue-400 opacity-50 rotate-180"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 justify-center"
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <p className="text-green-300 text-sm">知识已复制到剪贴板！</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* 底部装饰 */}
        <motion.div
          className="mt-6 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>知识挖掘者</span>
            </span>
            <span>探索美食的奥秘</span>
          </div>
        </motion.div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes sparkle-float {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -120%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -200%) scale(0);
            opacity: 0;
          }
        }
        
        .animate-sparkle-float {
          animation: sparkle-float 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}