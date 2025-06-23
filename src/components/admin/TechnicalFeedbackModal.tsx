import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, MessageSquare, User } from 'lucide-react';
import { technicalFeedbackService, candidateService } from '../../services/adminService';
import { format } from 'date-fns';
import type { Database } from '../../lib/supabase';

type TechnicalFeedback = Database['public']['Tables']['technical_feedback']['Row'];

interface TechnicalFeedbackModalProps {
  candidateId: string;
  onClose: () => void;
}

export const TechnicalFeedbackModal: React.FC<TechnicalFeedbackModalProps> = ({ candidateId, onClose }) => {
  const [feedback, setFeedback] = useState<TechnicalFeedback[]>([]);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<TechnicalFeedback | null>(null);
  const [formData, setFormData] = useState({
    mentor_name: '',
    feedback_text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [candidateId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedbackData, candidateData] = await Promise.all([
        technicalFeedbackService.getByCandidateId(candidateId),
        candidateService.getById(candidateId)
      ]);
      setFeedback(feedbackData);
      setCandidate(candidateData);
    } catch (err) {
      setError('Failed to load feedback data');
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mentor_name.trim() || !formData.feedback_text.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (editingFeedback) {
        await technicalFeedbackService.update(editingFeedback.feedback_id, formData);
      } else {
        await technicalFeedbackService.create({
          candidate_id: candidateId,
          mentor_name: formData.mentor_name,
          feedback_text: formData.feedback_text
        });
      }
      
      await loadData();
      setShowForm(false);
      setEditingFeedback(null);
      setFormData({ mentor_name: '', feedback_text: '' });
    } catch (err) {
      setError('Failed to save feedback');
      console.error('Error saving feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (feedbackItem: TechnicalFeedback) => {
    setEditingFeedback(feedbackItem);
    setFormData({
      mentor_name: feedbackItem.mentor_name,
      feedback_text: feedbackItem.feedback_text
    });
    setShowForm(true);
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await technicalFeedbackService.delete(feedbackId);
      await loadData();
    } catch (err) {
      setError('Failed to delete feedback');
      console.error('Error deleting feedback:', err);
    }
  };

  const handleAddNew = () => {
    setEditingFeedback(null);
    setFormData({ mentor_name: '', feedback_text: '' });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary-900 flex items-center space-x-2">
                <MessageSquare className="w-6 h-6" />
                <span>Technical Feedback</span>
              </h2>
              {candidate && (
                <p className="text-neutral-600 mt-1">
                  {candidate.full_name} - {candidate.role || 'No role specified'}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Add Feedback Button */}
          <div className="mb-6">
            <button
              onClick={handleAddNew}
              className="flex items-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technical Feedback</span>
            </button>
          </div>

          {/* Feedback Form */}
          {showForm && (
            <div className="bg-neutral-50 rounded-xl p-6 mb-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                {editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mentor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.mentor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, mentor_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="Enter mentor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Technical Feedback *
                  </label>
                  <textarea
                    value={formData.feedback_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback_text: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="Enter detailed technical feedback..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingFeedback(null);
                      setFormData({ mentor_name: '', feedback_text: '' });
                    }}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingFeedback ? 'Update Feedback' : 'Add Feedback'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feedback List */}
          <div className="space-y-4">
            {feedback.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No technical feedback yet</h3>
                <p className="text-neutral-500">Add the first technical feedback for this candidate.</p>
              </div>
            ) : (
              feedback.map((feedbackItem) => (
                <div key={feedbackItem.feedback_id} className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary-900">{feedbackItem.mentor_name}</h4>
                        <p className="text-sm text-neutral-600">
                          {format(new Date(feedbackItem.created_at), 'MMM dd, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(feedbackItem)}
                        className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="Edit Feedback"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(feedbackItem.feedback_id)}
                        className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {feedbackItem.feedback_text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};