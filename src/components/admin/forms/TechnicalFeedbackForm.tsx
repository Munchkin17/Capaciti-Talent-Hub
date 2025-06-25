import React, { useState, useEffect } from 'react';
import { X, Save, MessageSquare, User } from 'lucide-react';
import { technicalFeedbackService } from '../../../services/adminService';
import type { Database } from '../../../lib/supabase';

type TechnicalFeedback = Database['public']['Tables']['technical_feedback']['Row'];
type Candidate = Database['public']['Tables']['candidates']['Row'];

interface TechnicalFeedbackFormProps {
  feedback?: TechnicalFeedback | null;
  candidates: Candidate[];
  onClose: () => void;
  onSave: () => void;
}

export const TechnicalFeedbackForm: React.FC<TechnicalFeedbackFormProps> = ({ 
  feedback, 
  candidates, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    candidate_id: '',
    mentor_name: '',
    feedback_text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      setFormData({
        candidate_id: feedback.candidate_id || '',
        mentor_name: feedback.mentor_name,
        feedback_text: feedback.feedback_text
      });
    }
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidate_id || !formData.mentor_name.trim() || !formData.feedback_text.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (feedback) {
        await technicalFeedbackService.update(feedback.feedback_id, {
          mentor_name: formData.mentor_name.trim(),
          feedback_text: formData.feedback_text.trim()
        });
      } else {
        await technicalFeedbackService.create({
          candidate_id: formData.candidate_id,
          mentor_name: formData.mentor_name.trim(),
          feedback_text: formData.feedback_text.trim()
        });
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900">
              {feedback ? 'Edit Technical Feedback' : 'Add Technical Feedback'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Candidate Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select Candidate *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <select
                value={formData.candidate_id}
                onChange={(e) => handleInputChange('candidate_id', e.target.value)}
                disabled={!!feedback} // Disable editing candidate for existing feedback
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white disabled:bg-neutral-100"
                required
              >
                <option value="">Choose a candidate...</option>
                {candidates.map(candidate => (
                  <option key={candidate.candidate_id} value={candidate.candidate_id}>
                    {candidate.full_name} - {candidate.role || 'No role specified'}
                  </option>
                ))}
              </select>
            </div>
            {feedback && (
              <p className="text-xs text-neutral-500 mt-1">
                Candidate cannot be changed when editing existing feedback
              </p>
            )}
          </div>

          {/* Mentor Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mentor Name *
            </label>
            <input
              type="text"
              value={formData.mentor_name}
              onChange={(e) => handleInputChange('mentor_name', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
              placeholder="Enter mentor's full name"
              required
            />
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Technical Feedback *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
              <textarea
                value={formData.feedback_text}
                onChange={(e) => handleInputChange('feedback_text', e.target.value)}
                rows={6}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                placeholder="Provide detailed technical feedback about the candidate's performance, skills, areas of improvement, strengths, etc."
                required
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              This feedback will be visible on the candidate's public profile
            </p>
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
              <span>{loading ? 'Saving...' : feedback ? 'Update Feedback' : 'Add Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};