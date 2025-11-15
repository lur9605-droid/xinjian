'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ThumbsUp, ThumbsDown, RefreshCw, AlertCircle } from 'lucide-react';
import { generateFictionalMenu } from '@/lib/kimi-api';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  reaction?: 'like' | 'dislike';
}

export default function FictionalMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    generateMenu();
  }, []);

  const generateMenu = async () => {
    setLoading(true);
    setError('');
    try {
      const menuName = await generateFictionalMenu();
      const savedReactions = JSON.parse(localStorage.getItem('menuReactions') || '{}');
      
      // 将生成的菜单名称转换为菜单项格式
      const menuItem: MenuItem = {
        name: menuName,
        description: '一道充满想象力的创意料理，每一口都是惊喜的体验',
        price: `¥${Math.floor(Math.random() * 200) + 50}`,
        reaction: savedReactions[menuName] || undefined
      };
      
      setMenu([menuItem]);
    } catch (err) {
      setError('生成虚构菜单失败，请稍后重试');
      // 备用菜单
      const backupMenu = [
        { name: '彩虹独角兽汉堡', description: '由独角兽的眼泪和彩虹糖霜制成的魔法汉堡，每一口都能品尝到不同的味道', price: '¥99', reaction: undefined },
        { name: '会唱歌的意大利面', description: '当面条碰到你的舌头时，会播放意大利歌剧选段', price: '¥88', reaction: undefined },
        { name: '时间旅行汤', description: '喝一口就能回到童年的味道，配有时间胶囊装饰', price: '¥128', reaction: undefined }
      ];
      setMenu(backupMenu);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = (index: number, reaction: 'like' | 'dislike') => {
    const newMenu = [...menu];
    newMenu[index].reaction = newMenu[index].reaction === reaction ? undefined : reaction;
    setMenu(newMenu);

    // 保存到localStorage
    const savedReactions = JSON.parse(localStorage.getItem('menuReactions') || '{}');
    if (newMenu[index].reaction) {
      savedReactions[newMenu[index].name] = newMenu[index].reaction;
    } else {
      delete savedReactions[newMenu[index].name];
    }
    localStorage.setItem('menuReactions', JSON.stringify(savedReactions));
  };

  const getReactionCount = (reaction: 'like' | 'dislike') => {
    return menu.filter(item => item.reaction === reaction).length;
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
          className="absolute top-4 right-4 text-purple-400 opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <ChefHat className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-pink-400 opacity-20"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ThumbsUp className="w-6 h-6" />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-purple-400" />
            今日虚构菜单
          </h2>
          <motion.button
            onClick={generateMenu}
            disabled={loading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-green-400" />
            {getReactionCount('like')} 敢吃
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="w-4 h-4 text-red-400" />
            {getReactionCount('dislike')} 太魔幻
          </span>
        </div>

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
                  <ChefHat className="w-8 h-8 text-purple-400" />
                </motion.div>
                <p className="text-white/60">AI正在创造魔幻料理...</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {menu.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 rounded-xl p-4 relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                    <span className="text-purple-400 font-bold">{item.price}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleReaction(index, 'like')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                        item.reaction === 'like'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      我敢吃
                    </motion.button>
                    <motion.button
                      onClick={() => handleReaction(index, 'dislike')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                        item.reaction === 'dislike'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      太魔幻了
                    </motion.button>
                  </div>

                  {/* 装饰性边框 */}
                  {item.reaction && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl border-2 ${
                        item.reaction === 'like' ? 'border-green-400/30' : 'border-red-400/30'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

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
              <ChefHat className="w-3 h-3" />
              <span>AI 魔幻料理</span>
            </span>
            <span>投票结果自动保存</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}