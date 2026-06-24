import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, ThumbsUp, PlusCircle, FileText, Send, Share2, Compass, AlertCircle } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // New post form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    category: 'Discussion',
    fileUrl: ''
  });

  // Track comments input box by post ID
  const [commentInputs, setCommentInputs] = useState({}); // { postId: string }
  const [expandedComments, setExpandedComments] = useState({}); // { postId: boolean }

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      const res = await axios.get('/api/community', { params });
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading community posts:", err);
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formData.author || !formData.title || !formData.content) {
      alert("Please fill in author, title, and post content.");
      return;
    }

    try {
      const res = await axios.post('/api/community', formData);
      setPosts(prev => [res.data, ...prev]);
      setShowForm(false);
      setFormData({
        author: '',
        title: '',
        content: '',
        category: 'Discussion',
        fileUrl: ''
      });
    } catch (err) {
      console.error("Error writing post:", err);
    }
  };

  const handleLikePost = async (id) => {
    try {
      const res = await axios.post(`/api/community/${id}/like`);
      // Update local state immediately
      setPosts(prev => prev.map(p => p._id === id ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (e, id) => {
    e.preventDefault();
    const commentText = commentInputs[id];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await axios.post(`/api/community/${id}/comments`, {
        author: 'You (Student)',
        content: commentText
      });
      // Update local post in state
      setPosts(prev => prev.map(p => p._id === id ? { ...p, comments: res.data.comments } : p));
      setCommentInputs(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleComments = (id) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Community Forum</h1>
          <p className="text-sm text-slate-400">Share study materials, ask complex questions, and collaborate on preparation strategies.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="glass-panel p-6 rounded-2xl border-violet-500/20 max-w-xl">
          <h3 className="text-base font-bold mb-4">Write a Community Post</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Your Name *</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Post Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="Discussion">Discussion Forum</option>
                  <option value="Notes">Notes Share</option>
                  <option value="Q&A">Q&A Help</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Topic Title *</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Briefly state your topic..."
                className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Content Description *</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Explain in detail. Share advice or ask questions..."
                className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white h-24 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {formData.category === 'Notes' && (
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notes Document Name (Optional)</label>
                <input 
                  type="text" 
                  value={formData.fileUrl} 
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="e.g. Modern_History_Timeline.pdf"
                  className="w-full mt-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Tabs Filter */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          onClick={() => setCategoryFilter('')}
          className={`py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
            categoryFilter === '' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setCategoryFilter('Discussion')}
          className={`py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
            categoryFilter === 'Discussion' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Discussions
        </button>
        <button
          onClick={() => setCategoryFilter('Notes')}
          className={`py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
            categoryFilter === 'Notes' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Revision Notes
        </button>
        <button
          onClick={() => setCategoryFilter('Q&A')}
          className={`py-3 px-4 border-b-2 font-bold cursor-pointer transition-all ${
            categoryFilter === 'Q&A' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Q&A Boards
        </button>
      </div>

      {/* Posts Stream */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-slate-800">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No Posts Published</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first to ask a question or share revision notes in this category!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isNote = post.category === 'Notes';
            const isQna = post.category === 'Q&A';
            const commentsOpen = !!expandedComments[post._id];

            return (
              <div 
                key={post._id}
                className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-slate-700/60 transition-all duration-300 space-y-4"
              >
                {/* Author Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center font-bold">
                      {post.author[0]}
                    </span>
                    <span className="font-semibold text-slate-300">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      isNote 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                        : isQna 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    }`}>
                      {post.category}
                    </span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-100">{post.title}</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Shareable Notes PDF Tag */}
                  {isNote && post.fileUrl && (
                    <div className="flex items-center space-x-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs max-w-xs cursor-pointer hover:border-cyan-500/30 transition-colors">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-200 truncate">{post.fileUrl}</p>
                        <p className="text-[10px] text-slate-500">Shared Study Resource • 1.2 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center space-x-4 text-xs pt-2 border-t border-slate-800/50">
                  {/* Like Button */}
                  <button 
                    onClick={() => handleLikePost(post._id)}
                    className="flex items-center space-x-1.5 hover:text-violet-400 transition-colors cursor-pointer text-slate-400"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-semibold">{post.likes} Upvotes</span>
                  </button>

                  {/* Comment Toggle */}
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center space-x-1.5 hover:text-violet-400 transition-colors cursor-pointer text-slate-400"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{post.comments.length} Comments</span>
                  </button>
                </div>

                {/* Comments Expand Drawer */}
                {commentsOpen && (
                  <div className="pt-4 border-t border-slate-800 space-y-4 bg-slate-950/20 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-400">Comments</h4>
                    
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-500">No responses yet. Add your thoughts below.</p>
                    ) : (
                      <div className="space-y-3 pl-2 border-l border-slate-800">
                        {post.comments.map((c, cIdx) => (
                          <div key={cIdx} className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-300">{c.author}</span>
                              <span className="text-[9px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Comment Form */}
                    <form 
                      onSubmit={(e) => handleAddComment(e, post._id)}
                      className="flex space-x-2 pt-2"
                    >
                      <input 
                        type="text"
                        value={commentInputs[post._id] || ''}
                        onChange={e => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                        placeholder="Add a reply..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                      <button 
                        type="submit"
                        className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
