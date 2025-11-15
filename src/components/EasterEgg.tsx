'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { generateEasterEgg } from '@/lib/kimi-api';

export default function EasterEgg() {
  const [showEgg, setShowEgg] = useState(false);
  const [eggContent, setEggContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = async () => {
    setClickCount(prev => prev + 1);
    
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const content = await generateEasterEgg();
      setEggContent(content);
      setShowEgg(true);
      
      // 3秒后自动隐藏
      setTimeout(() => {
        setShowEgg(false);
      }, 3000);
    } catch (err) {
      setError('获取彩蛋失败，请稍后重试');
      // 备用彩蛋
      const backupEggs = [
        '🎉 恭喜你发现了神秘的"吃货宇宙"！在这里，每一口美食都藏着一个平行世界！',
        '🌟 传说集齐7个美食彩蛋可以召唤"饿了么神龙"，它会满足你一个关于吃的愿望！',
        '🎭 你刚刚触发了"美食时空裂缝"，现在你可以品尝到来自未来的分子料理！',
        '🦄 恭喜你解锁了"独角兽餐厅"的隐藏菜单，这里的每道菜都会让你飘起来！',
        '🔮 神秘的美食占卜师告诉你：今天你会遇到命中注定的那道菜！',
        '🎪 欢迎来到"美食马戏团"，这里的表演者都是会跳舞的食物！',
        '🌈 你发现了"彩虹厨房"的秘密入口，里面的食物都是七彩斑斓的！',
        '🎨 恭喜你获得了"美食艺术家"称号，现在你可以用食物创作艺术品了！',
        '🎭 你刚刚进入了"美食戏剧院"，每一道菜都在上演着精彩的故事！',
        '🚀 恭喜你启动了"美食火箭"，准备开始一场味觉的太空旅行！'
      ];
      setEggContent(backupEggs[Math.floor(Math.random() * backupEggs.length)]);
      setShowEgg(true);
      
      setTimeout(() => {
        setShowEgg(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // 根据点击次数改变按钮样式
  const getButtonStyle = () => {
    const baseStyle = "fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center";
    
    if (clickCount === 0) {
      return `${baseStyle} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`;
    } else if (clickCount < 5) {
      return `${baseStyle} bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600`;
    } else if (clickCount < 10) {
      return `${baseStyle} bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600`;
    } else {
      return `${baseStyle} bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse`;
    }
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={getButtonStyle()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          scale: 1.15,
          rotate: clickCount % 2 === 0 ? 5 : -5
        }}
        whileTap={{ scale: 0.9 }}
        animate={showEgg ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 360] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        >
          {loading ? (
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -100 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative max-w-md mx-4">
              {/* 背景光效 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-3xl blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* 主内容 */}
              <motion.div
                className="relative glass-morphism rounded-3xl p-8 text-center border border-white/20"
                animate={{
                  rotate: [0, 2, -2, 0],
                  scale: [1, 1.02, 1.02, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* 装饰性元素 */}
                <motion.div
                  className="absolute -top-4 -left-4 text-4xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  🎊
                </motion.div>
                <motion.div
                  className="absolute -top-4 -right-4 text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 text-4xl"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🌟
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-4 text-4xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  🎭
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  神秘彩蛋！
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/90 leading-relaxed"
                >
                  {eggContent}
                </motion.p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-2 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-2 justify-center"
                  >
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <p className="text-orange-300 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* 进度指示器 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 flex justify-center space-x-1"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}