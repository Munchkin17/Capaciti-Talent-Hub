import React, { useState, useEffect } from 'react';
import { X, Save, Target, Calendar, BookOpen } from 'lucide-react';
import { challengeService } from '../../../services/adminService';
import type { Database } from '../../../lib/supabase';

type Challenge = Database['public']['Tables']['challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['challenges']['Insert'];

interface ChallengeFormProps {
  challenge?: Challenge;
  onClose: () => void;
  onSave: () => void;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({ challenge, onClose, onSave }) => {
  const [formData, setFormData] = useState<ChallengeInsert>({
    title: '',
    description: '',
    topic: '',
    max_score: 100,
    date_assigned: new Date().toISOString().split('T')[0],
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (challenge) {
      setFormData({
        title: challenge.title,
        description: challenge.description || '',
        topic: challenge.topic || '',
        max_score: challenge.max_score || 100,
        date_assigned: challenge.date_assigned,
        due_date: challenge.due_date || ''
      });
    }
  }, [challenge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (challenge) {
        await challengeService.update(challenge.challenge_id, formData);
      } else {
        await challengeService.create(formData);
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ChallengeInsert, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const topicOptions = [
    'Python',
    'JavaScript',
    'React',
    'Node.js',
    'SQL',
    'HTML/CSS',
    'Data Analysis',
    'Machine Learning',
    'Web Development',
    'API Development',
    'Database Design',
    'UI/UX Design',
    'DevOps',
    'Testing',
    'Git & Version Control'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900">
              {challenge ? 'Edit Challenge' : 'Add New Challenge'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Challenge Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary-900 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Challenge Details</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  placeholder="e.g., Python Data Structures Challenge"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Topic/Category
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <select
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select a topic</option>
                    {topicOptions.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  placeholder="Detailed description of the challenge requirements and objectives..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => handleInputChange('max_score', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    min="1"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date Assigned *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.date_assigned}
                      onChange={(e) => handleInputChange('date_assigned', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleInputChange('due_date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 font-medium disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : challenge ? 'Update Challenge' : 'Create Challenge'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};