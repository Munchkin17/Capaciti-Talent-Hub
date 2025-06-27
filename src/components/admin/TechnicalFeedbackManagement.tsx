import React, { useState } from 'react';
import { Plus, MessageSquare, Edit, Trash2, User, Calendar, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCandidatesWithCohorts } from '../../hooks/useSupabaseData';
import { technicalFeedbackService } from '../../services/adminService';
import { TechnicalFeedbackForm } from './forms/TechnicalFeedbackForm';
import { format } from 'date-fns';
import type { Database } from '../../lib/supabase';

type TechnicalFeedback = Database['public']['Tables']['technical_feedback']['Row'] & {
  candidates?: Database['public']['Tables']['candidates']['Row'];
};

export const TechnicalFeedbackManagement: React.FC = () => {
  const { data: candidates, loading: candidatesLoading } = useCandidatesWithCohorts();
  const [feedback, setFeedback] = useState<TechnicalFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<TechnicalFeedback | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  React.useEffect(() => {
    loadAllFeedback();
  }, []);

  const loadAllFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('technical_feedback')
        .select(`
          *,
          candidates (
            candidate_id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFeedback(data || []);
    } catch (err) {
      setError('Failed to load technical feedback');
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedbackItem: TechnicalFeedback) => {
    setEditingFeedback(feedbackItem);
    setShowForm(true);
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      await technicalFeedbackService.delete(feedbackId);
      await loadAllFeedback();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete feedback');
      console.error('Error deleting feedback:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingFeedback(null);
  };

  const handleFormSave = () => {
    loadAllFeedback();
  };

  const filteredFeedback = feedback.filter(item => {
    const candidate = item.candidates;
    const matchesSearch = !searchTerm || 
      candidate?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mentor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedback_text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCandidate = !selectedCandidate || item.candidate_id === selectedCandidate;
    
    return matchesSearch && matchesCandidate;
  });

  if (candidatesLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Technical Feedback Management</h2>
          <p className="text-neutral-600">Manage technical feedback from mentors for all candidates.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technical Feedback</span>
        </button>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Feedback</p>
              <p className="text-2xl font-bold text-primary-900">{feedback.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Unique Mentors</p>
              <p className="text-2xl font-bold text-secondary-600">
                {new Set(feedback.map(f => f.mentor_name)).size}
              </p>
            </div>
            <User className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Candidates with Feedback</p>
              <p className="text-2xl font-bold text-success-600">
                {new Set(feedback.map(f => f.candidate_id)).size}
              </p>
            </div>
            <User className="w-8 h-8 text-success-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-accent-600">
                {feedback.filter(f => {
                  const feedbackDate = new Date(f.created_at);
                  const now = new Date();
                  return feedbackDate.getMonth() === now.getMonth() && 
                         feedbackDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-accent-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by candidate name, mentor, or feedback content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="pl-9 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white min-w-48"
            >
              <option value="">All Candidates</option>
              {candidates.map(candidate => (
                <option key={candidate.candidate_id} value={candidate.candidate_id}>
                  {candidate.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-neutral-600">
          Showing {filteredFeedback.length} of {feedback.length} feedback entries
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedbackItem) => (
          <div key={feedbackItem.feedback_id} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-bold text-primary-900">{feedbackItem.candidates?.full_name}</h4>
                    <span className="text-sm text-neutral-600">•</span>
                    <span className="text-sm text-neutral-600">{feedbackItem.candidates?.role || 'No role specified'}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span className="font-medium">Mentor: {feedbackItem.mentor_name}</span>
                    <span>•</span>
                    <span>{format(new Date(feedbackItem.created_at), 'MMM dd, yyyy • h:mm a')}</span>
                  </div>
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
                  onClick={() => setDeleteConfirm(feedbackItem.feedback_id)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  title="Delete Feedback"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {feedbackItem.feedback_text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No technical feedback found</h3>
          <p className="text-neutral-500 mb-6">
            {searchTerm || selectedCandidate
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding the first technical feedback entry.'
            }
          </p>
          {!searchTerm && !selectedCandidate && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
            >
              Add First Feedback
            </button>
          )}
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <TechnicalFeedbackForm
          feedback={editingFeedback}
          candidates={candidates}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Confirm Deletion</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this technical feedback? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};