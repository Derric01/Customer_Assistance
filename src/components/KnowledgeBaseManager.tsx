/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, FiFolder, FiFileText, FiBookOpen } from 'react-icons/fi';

type KnowledgeCategory = 'FAQ' | 'Docs' | 'Rulebook';

type KnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function KnowledgeBaseManager() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'FAQ' as KnowledgeCategory,
    tags: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Loading knowledge base data...");
        
        // Check for existing data in localStorage
        const savedData = localStorage.getItem('knowledge-base');
        
        if (savedData) {
          console.log("Knowledge base data found in localStorage");
          const parsedData = JSON.parse(savedData);
          setEntries(parsedData);
        } else {
          console.log("No knowledge base data found, generating samples");
          const sampleEntries = generateSampleEntries();
          setEntries(sampleEntries);
          localStorage.setItem('knowledge-base', JSON.stringify(sampleEntries));
        }
      } catch (error) {
        console.error("Error loading knowledge base:", error);
        // Fallback to sample entries in case of error
        const sampleEntries = generateSampleEntries();
        setEntries(sampleEntries);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  function generateSampleEntries(): KnowledgeEntry[] {
    const now = new Date().toISOString();
    
    return [
      {
        id: `entry-${Date.now()}-1`,
        title: 'How to reset your password',
        content: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
        category: 'FAQ',
        tags: ['password', 'login', 'account'],
        createdAt: now,
        updatedAt: now
      },
      {
        id: `entry-${Date.now()}-2`,
        title: 'Product Return Policy',
        content: 'Products can be returned within 30 days of purchase with a valid receipt. Refunds will be processed to the original payment method within 5-7 business days.',
        category: 'Rulebook',
        tags: ['returns', 'refunds', 'policy'],
        createdAt: now,
        updatedAt: now
      },
      {
        id: `entry-${Date.now()}-3`,
        title: 'API Authentication',
        content: 'To authenticate with the API, you need to include your API key in the Authorization header of your request: Authorization: Bearer YOUR_API_KEY.',
        category: 'Docs',
        tags: ['api', 'authentication', 'developer'],
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateEntry = () => {
    const newEntry: KnowledgeEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('knowledge-base', JSON.stringify(updatedEntries));
    
    resetForm();
    setIsCreating(false);
  };

  const handleUpdateEntry = () => {
    if (!editingId) return;
    
    const updatedEntries = entries.map(entry => 
      entry.id === editingId ? 
        {
          ...entry,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          updatedAt: new Date().toISOString()
        } : entry
    );
    
    setEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('knowledge-base', JSON.stringify(updatedEntries));
    
    resetForm();
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      
      // Save to localStorage
      localStorage.setItem('knowledge-base', JSON.stringify(updatedEntries));
      
      if (editingId === id) {
        resetForm();
        setEditingId(null);
      }
    }
  };

  const startEditing = (entry: KnowledgeEntry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags.join(', ')
    });
    setEditingId(entry.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'FAQ',
      tags: ''
    });
  };

  const cancelEditing = () => {
    resetForm();
    setEditingId(null);
    setIsCreating(false);
  };

  const getCategoryIcon = (category: KnowledgeCategory) => {
    switch (category) {
      case 'FAQ':
        return <FiBookOpen className="w-4 h-4" />;
      case 'Docs':
        return <FiFileText className="w-4 h-4" />;
      case 'Rulebook':
        return <FiFolder className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: KnowledgeCategory) => {
    switch (category) {
      case 'FAQ':
        return 'bg-green-900/30 text-green-300';
      case 'Docs':
        return 'bg-purple-900/30 text-purple-300';
      case 'Rulebook':
        return 'bg-indigo-900/30 text-indigo-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };
  
  const formatDate = (date: string | Date) => {
    if (!date) return 'Unknown date';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-gray-700 pb-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-300">Knowledge Base Manager</h1>
          <button
            onClick={() => { setIsCreating(true); setEditingId(null); resetForm(); }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add New Entry
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-gray-100">Filters</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-100 sm:text-sm"
                      placeholder="Search knowledge base"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                        activeCategory === 'all' 
                          ? 'bg-purple-900/30 text-purple-300' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      title="Show all categories"
                    >
                      All Categories
                    </button>
                    {(['FAQ', 'Docs', 'Rulebook'] as KnowledgeCategory[]).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                          activeCategory === category
                            ? getCategoryColor(category)
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        title={`Show only ${category} entries`}
                      >
                        <span className="mr-2">{getCategoryIcon(category)}</span>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-800 rounded-lg shadow overflow-hidden p-4">
              <div className="text-sm text-gray-400">
                <p className="mb-2">{entries.length} total entries</p>
                <p>{filteredEntries.length} entries shown</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {(isCreating || editingId) && (
              <div className="bg-gray-800 rounded-lg shadow mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-100">
                    {editingId ? 'Edit Entry' : 'Create New Entry'}
                  </h2>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-300"
                    title="Cancel editing"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-700 text-gray-100"
                      placeholder="Entry title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as KnowledgeCategory})}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-700 text-gray-100"
                    >
                      <option value="FAQ">FAQ</option>
                      <option value="Docs">Documentation</option>
                      <option value="Rulebook">Rulebook</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
                    <textarea
                      id="content"
                      name="content"
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-700 text-gray-100"
                      placeholder="Enter the knowledge content here..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-700 text-gray-100"
                      placeholder="Tags (comma separated)"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={editingId ? handleUpdateEntry : handleCreateEntry}
                      disabled={!formData.title || !formData.content}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave className="-ml-1 mr-2 h-5 w-5" />
                      {editingId ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {filteredEntries.length === 0 ? (
              <div className="bg-gray-800 rounded-lg shadow p-6 text-center">
                <p className="text-gray-400">No entries found. Create a new entry or adjust your filters.</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-700">
                  {filteredEntries.map((entry) => (
                    <li key={entry.id} className="p-6 border-b border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center h-9 w-9 rounded-full ${getCategoryColor(entry.category)}`}>
                            {getCategoryIcon(entry.category)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-100">{entry.title}</p>
                            <p className="text-xs text-gray-400">
                              Updated {formatDate(entry.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(entry)}
                            className="text-gray-400 hover:text-purple-400"
                            title="Edit entry"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-gray-400 hover:text-red-400"
                            title="Delete entry"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{entry.content}</p>
                      </div>
                      {entry.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 