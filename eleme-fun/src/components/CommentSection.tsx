'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Clock, User, Trash2, Edit3 } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const savedComments = localStorage.getItem('foodComments');
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments).map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }));
        setComments(parsedComments);
      } catch (error) {
        console.error('加载评论失败:', error);
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem('foodComments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && charCount <= 100) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setCharCount(0);
    }
  };

  const handleLike = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          }
        : comment
    ));
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setNewComment(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          美食感悟
        </h2>
        <span className="text-sm text-white/60">
          {comments.length} 条感悟
        </span>
      </div>

      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={handleInputChange}
            placeholder="分享你的美食感悟... (限100字)"
            className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            rows={isMobile ? 2 : 3}
            maxLength={100}
          />
          <motion.button
            type="submit"
            disabled={!newComment.trim()}
            className="absolute bottom-3 right-3 p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:opacity-50 rounded-full transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs ${charCount > 80 ? 'text-red-400' : 'text-white/40'}`}>
            {charCount}/100
          </span>
          <span className="text-xs text-white/40">
            分享你的美食心情
          </span>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="flex flex-col items-center space-y-3 text-white/40">
                <MessageCircle className="w-12 h-12" />
                <p className="text-sm">还没有人分享美食感悟</p>
                <p className="text-xs">来做第一个分享的人吧！</p>
              </div>
            </motion.div>
          ) : (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 font-medium">美食家</p>
                      <div className="flex items-center space-x-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(comment.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 text-white/40 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {comment.text}
                </p>
                
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                      comment.isLiked 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={comment.isLiked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                    </motion.div>
                    <span>{comment.likes}</span>
                  </motion.button>
                  
                  <span className="text-xs text-white/40">
                    {comment.text.length} 字
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 底部提示 */}
      <motion.div
        className="mt-6 pt-4 border-t border-white/10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-white/40">
          💝 每一条美食感悟都是珍贵的回忆
        </p>
      </motion.div>
    </div>
  );
}