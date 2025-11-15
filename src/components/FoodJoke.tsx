'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Utensils, Sparkles, Heart, Share2, Copy, AlertCircle } from 'lucide-react';
import { generateFoodJoke } from '@/lib/kimi-api';

export default function FoodJoke() {
  const [joke, setJoke] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jokeCount, setJokeCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    generateJoke();
  }, []);

  const generateJoke = async () => {
    setLoading(true);
    setError('');
    setLiked(false);
    try {
      const newJoke = await generateFoodJoke();
      setJoke(newJoke);
      setJokeCount(prev => prev + 1);
      
      // 每5个段子触发一次特效
      if ((jokeCount + 1) % 5 === 0) {
        triggerSpecialEffect();
      }
    } catch (err) {
      setError('获取美食段子失败，请稍后重试');
      // 备用段子
      const backupJokes = [
        '为什么厨师总是很开心？因为他们每天都在"炒"作！',
        '面包和馒头吵架了，面包说："你别太"馒"了！',
        '为什么火锅总是那么热闹？因为它喜欢"涮"存在感！',
        '面条和饺子比赛跑步，面条赢了，因为饺子太"胖"了！',
        '为什么冰淇淋总是心情不好？因为它太容易"融化"了！',
        '汉堡和披萨谁更受欢迎？当然是汉堡，因为它有"堡"障！',
        '为什么奶茶总是那么甜？因为它有"茶"不完的甜蜜！',
        '炸鸡和烤鸡的区别是什么？一个会"炸"，一个会"烤"！',
        '为什么寿司总是那么冷静？因为它有"鱼"生哲学！',
        '蛋糕和面包谁更幸福？当然是蛋糕，因为它有"蛋"生的快乐！'
      ];
      setJoke(backupJokes[Math.floor(Math.random() * backupJokes.length)]);
    } finally {
      setLoading(false);
    }
  };

  const triggerSpecialEffect = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      // 创建飘心动画
      createFloatingHeart();
    }
  };

  const createFloatingHeart = () => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'absolute pointer-events-none text-2xl animate-float-up';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joke);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = joke;
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
          title: '美食段子',
          text: joke,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 降级到复制
      handleCopy();
    }
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
          className="absolute top-4 right-4 text-orange-400 opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Utensils className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-yellow-400 opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>

      {/* 特效粒子 - 使用固定值避免hydration不匹配 */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              initial={{ 
                x: (i * 47) % 100 + '%',
                y: '-10px',
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                y: '110%',
                opacity: 0,
                scale: [0, 1, 0],
                rotate: (i * 47) % 360
              }}
              transition={{ 
                duration: (i * 0.08) % 2 + 1,
                delay: (i * 0.025) % 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-400" />
            随机美食段子
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
              onClick={generateJoke}
              disabled={loading}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* 段子计数器 */}
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
            第 {jokeCount} 个段子 {liked && '❤️'}
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
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Utensils className="w-8 h-8 text-orange-400" />
                </motion.div>
                <p className="text-white/60">AI正在创作段子...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={joke}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="py-4"
            >
              <div className="relative">
                <motion.div
                  className="absolute -left-2 -top-2 text-orange-400 opacity-50"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Utensils className="w-4 h-4" />
                </motion.div>
                <p className="text-white/90 text-lg leading-relaxed pl-4">
                  {joke}
                </p>
                <motion.div
                  className="absolute -right-2 -bottom-2 text-yellow-400 opacity-50 rotate-180"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-4 h-4" />
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
            <p className="text-green-300 text-sm">段子已复制到剪贴板！</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <p className="text-orange-300 text-sm">{error}</p>
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
              <span>AI 段子手</span>
            </span>
            <span>点击按钮获取新段子</span>
          </div>
        </motion.div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -150%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -250%) scale(0);
            opacity: 0;
          }
        }
        
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}