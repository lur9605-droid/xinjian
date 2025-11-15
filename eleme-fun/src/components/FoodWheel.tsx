'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Utensils, Sparkles, Heart, Share2, Copy, AlertCircle, Trophy, Star } from 'lucide-react';
import { generateRandomFood } from '@/lib/kimi-api';

interface FoodItem {
  name: string;
  emoji: string;
  color: string;
}

const foodItems: FoodItem[] = [
  { name: '火锅', emoji: '🍲', color: 'bg-red-500' },
  { name: '烧烤', emoji: '🍖', color: 'bg-orange-500' },
  { name: '日料', emoji: '🍣', color: 'bg-pink-500' },
  { name: '川菜', emoji: '🌶️', color: 'bg-red-600' },
  { name: '粤菜', emoji: '🥟', color: 'bg-green-500' },
  { name: '西餐', emoji: '🍽️', color: 'bg-blue-500' },
  { name: '韩料', emoji: '🍜', color: 'bg-yellow-500' },
  { name: '甜品', emoji: '🍰', color: 'bg-purple-500' },
  { name: '快餐', emoji: '🍔', color: 'bg-yellow-600' },
  { name: '素食', emoji: '🥗', color: 'bg-green-400' },
  { name: '海鲜', emoji: '🦐', color: 'bg-cyan-500' },
  { name: '小吃', emoji: '🥨', color: 'bg-amber-500' }
];

export default function FoodWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [rotation, setRotation] = useState(0);
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [spinCount, setSpinCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  const spinWheel = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedFood(null);
    setAiRecommendation('');
    setError('');
    setLiked(false);
    
    // 随机旋转角度 + 多圈旋转 - 使用固定算法避免hydration不匹配
    const randomRotation = (spinCount * 137.5) % 360; // 使用黄金角算法
    const totalRotation = 1800 + randomRotation; // 5圈 + 随机角度
    setRotation(prev => prev + totalRotation);
    
    // 增加旋转次数
    setSpinCount(prev => prev + 1);
    
    // 计算最终选中的食物
    const segmentAngle = 360 / foodItems.length;
    const finalAngle = (rotation + totalRotation) % 360;
    const selectedIndex = Math.floor((360 - finalAngle + segmentAngle / 2) / segmentAngle) % foodItems.length;
    const selected = foodItems[selectedIndex];
    
    // 等待旋转完成
    setTimeout(async () => {
      setSelectedFood(selected);
      setIsSpinning(false);
      
      // 获取AI推荐
  await getAIRecommendation(selected.name, selected.emoji);
      
      // 检查成就
      checkAchievements();
      
      // 每5次旋转触发庆祝
      if ((spinCount + 1) % 5 === 0) {
        triggerCelebration();
      }
    }, 3000);
  };

  const getAIRecommendation = async (foodType: string, foodEmoji: string) => {
    setLoading(true);
    try {
      const recommendation = await generateRandomFood();
      setAiRecommendation(recommendation);
    } catch (err) {
      setError('获取AI推荐失败');
      // 备用推荐
      const backupRecommendations: { [key: string]: string } = {
        '火锅': '推荐尝试麻辣火锅，配上新鲜的羊肉片和豆腐，再来一瓶冰啤酒，完美！',
        '烧烤': '羊肉串配孜然粉，再来点烤韭菜和烤茄子，最后来瓶冰镇可乐！',
        '日料': '三文鱼寿司配上芥末酱油，再来一碗味噌汤，清爽又健康！',
        '川菜': '麻婆豆腐配米饭，再来一份宫保鸡丁，辣得过瘾！',
        '粤菜': '白切鸡配姜葱酱，再来一份蒸蛋羹，清淡养生！',
        '西餐': '牛排配红酒，再来一份凯撒沙拉，浪漫又美味！',
        '韩料': '石锅拌饭配泡菜，再来一份烤肉，韩式风味十足！',
        '甜品': '提拉米苏配咖啡，再来一份马卡龙，甜蜜时光！',
        '快餐': '汉堡配薯条，再来一杯奶昔，经典搭配！',
        '素食': '蔬菜沙拉配坚果，再来一份豆腐汤，健康美味！',
        '海鲜': '清蒸鱼配柠檬，再来一份蒜蓉扇贝，鲜美无比！',
        '小吃': '小笼包配醋，再来一份豆浆，传统美味！'
      };
      setAiRecommendation(backupRecommendations[foodType] || '这个选择很棒！好好享受你的美食时光吧！');
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    if (spinCount === 1) newAchievements.push('首次旋转');
    if (spinCount === 10) newAchievements.push('旋转达人');
    if (spinCount === 50) newAchievements.push('旋转大师');
    if (spinCount === 100) newAchievements.push('旋转传奇');
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => !newAchievements.includes(a)));
      }, 3000);
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      createFoodSparkle();
    }
  };

  const createFoodSparkle = () => {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '🌟';
    sparkle.className = 'absolute pointer-events-none text-2xl animate-food-sparkle';
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    sparkle.style.transform = 'translate(-50%, -50%)';
    sparkle.style.zIndex = '1000';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 2000);
  };

  const handleCopy = async () => {
    if (!selectedFood || !aiRecommendation) return;
    
    const text = `今天吃${selectedFood.name}！${aiRecommendation}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!selectedFood || !aiRecommendation) return;
    
    const text = `今天吃${selectedFood.name}！${aiRecommendation}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '吃啥大转盘',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 h-full relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-4 right-4 text-purple-400 opacity-20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <RotateCcw className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-pink-400 opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Utensils className="w-6 h-6" />
        </motion.div>
      </div>

      {/* 成就通知 */}
      <AnimatePresence>
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full font-bold z-30"
            style={{ top: `${20 + index * 40}px` }}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              解锁成就: {achievement}!
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 庆祝特效 - 使用固定值避免hydration不匹配 */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              initial={{ 
                x: (i * 37) % 100 + '%',
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
                delay: (i * 0.02) % 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-400" />
            吃啥大转盘
          </h2>
          <div className="flex items-center gap-2">
            {selectedFood && (
              <>
                <motion.button
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    liked 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-red-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!selectedFood || loading}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  onClick={handleCopy}
                  className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-blue-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!selectedFood || !aiRecommendation}
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-green-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!selectedFood || !aiRecommendation}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </>
            )}
            <div className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
              <Star className="w-3 h-3 inline mr-1" />
              {spinCount}
            </div>
          </div>
        </div>

        {/* 转盘容器 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* 转盘 */}
            <motion.div
              className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
              }}
            >
              {foodItems.map((item, index) => {
                const angle = (360 / foodItems.length) * index;
                const nextAngle = (360 / foodItems.length) * (index + 1);
                
                // 使用固定的三角函数值避免hydration不匹配
                const getCoord = (angle: number) => {
                  const rad = (angle - 90) * Math.PI / 180;
                  // 使用四舍五入到小数点后6位确保一致性
                  return Math.round((50 + 50 * Math.cos(rad)) * 1000000) / 1000000;
                };
                
                const getYCoord = (angle: number) => {
                  const rad = (angle - 90) * Math.PI / 180;
                  return Math.round((50 + 50 * Math.sin(rad)) * 1000000) / 1000000;
                };
                
                const x1 = getCoord(angle);
                const y1 = getYCoord(angle);
                const x2 = getCoord(nextAngle);
                const y2 = getYCoord(nextAngle);
                
                return (
                  <div
                    key={item.name}
                    className={`absolute w-full h-full ${item.color} flex items-center justify-center text-white font-bold text-sm`}
                    style={{
                      clipPath: `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`,
                      WebkitClipPath: `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`
                    }}
                  >
                    <div 
                      className="flex flex-col items-center"
                      style={{ transform: `rotate(${angle + 15}deg)` }}
                    >
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="text-xs">{item.name}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            
            {/* 指针 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
            </div>
            
            {/* 中心按钮 */}
            <motion.button
              onClick={spinWheel}
              disabled={isSpinning}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 font-bold text-sm hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSpinning ? (
                <RotateCcw className="w-6 h-6 animate-spin" />
              ) : (
                '开始'
              )}
            </motion.button>
          </div>
        </div>

        {/* 结果显示 */}
        <AnimatePresence mode="wait">
          {selectedFood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-4"
            >
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">{selectedFood.emoji}</span>
                  <h3 className="text-2xl font-bold text-white">{selectedFood.name}</h3>
                  <span className="text-3xl">{selectedFood.emoji}</span>
                </div>
                
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <p className="text-white/60">AI正在推荐...</p>
                    </div>
                  </div>
                )}
                
                {aiRecommendation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <h4 className="text-sm font-semibold text-white/80">AI推荐</h4>
                      <Trophy className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{aiRecommendation}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-purple-400" />
            <p className="text-purple-300 text-sm">{error}</p>
          </motion.div>
        )}

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 justify-center"
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <p className="text-green-300 text-sm">推荐已复制到剪贴板！</p>
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
              <span>AI 美食顾问</span>
            </span>
            <span>让转盘决定你的下一餐</span>
          </div>
        </motion.div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes food-sparkle {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -120%) scale(1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -200%) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-food-sparkle {
          animation: food-sparkle 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}