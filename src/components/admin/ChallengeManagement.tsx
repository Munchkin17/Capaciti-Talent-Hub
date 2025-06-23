import React, { useState } from 'react';
import { Plus, Target, Calendar, Edit, Trash2, Download, Users } from 'lucide-react';
import { useChallengesWithResults } from '../../hooks/useSupabaseData';
import { challengeService, dataService } from '../../services/adminService';
import { ChallengeForm } from './forms/ChallengeForm';
import { format } from 'date-fns';

export const ChallengeManagement: React.FC = () => {
  const { data: challenges, loading, error, refetch } = useChallengesWithResults();
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (challenge: any) => {
    setEditingChallenge(challenge);
    setShowForm(true);
  };

  const handleDelete = async (challengeId: string) => {
    try {
      await challengeService.delete(challengeId);
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting challenge:', err);
    }
  };

  const handleExport = async () => {
    try {
      const { csv, filename } = await dataService.exportChallenges();
      dataService.downloadCSV(csv, filename);
    } catch (err) {
      console.error('Error exporting challenges:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChallenge(null);
  };

  const handleFormSave = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
        Error loading challenges: {error}
      </div>
    );
  }

  const totalResults = challenges.reduce((sum, challenge) => 
    sum + (challenge.challenge_results?.length || 0), 0
  );
  const avgScore = challenges.length > 0 ? 
    Math.round(challenges.reduce((sum, challenge) => {
      const results = challenge.challenge_results || [];
      const challengeAvg = results.length > 0 ? 
        results.reduce((s, r) => s + r.score, 0) / results.length : 0;
      return sum + challengeAvg;
    }, 0) / challenges.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Challenge Management</h2>
          <p className="text-neutral-600">Create and manage coding challenges and track candidate performance.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Challenge</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Challenges</p>
              <p className="text-2xl font-bold text-primary-900">{challenges.length}</p>
            </div>
            <Target className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Submissions</p>
              <p className="text-2xl font-bold text-success-600">{totalResults}</p>
            </div>
            <Users className="w-8 h-8 text-success-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Average Score</p>
              <p className="text-2xl font-bold text-secondary-600">{avgScore}%</p>
            </div>
            <Target className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-accent-600">
                {challenges.filter(c => {
                  const challengeDate = new Date(c.date_assigned);
                  const now = new Date();
                  return challengeDate.getMonth() === now.getMonth() && 
                         challengeDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-accent-600" />
          </div>
        </div>
      </div>

      {/* Challenges Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Challenge</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Topic</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Date Assigned</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Due Date</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Submissions</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Avg Score</th>
                <th className="text-right py-4 px-6 font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {challenges.map((challenge) => {
                const results = challenge.challenge_results || [];
                const avgChallengeScore = results.length > 0 ? 
                  Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;
                
                return (
                  <tr key={challenge.challenge_id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-primary-900">{challenge.title}</div>
                        {challenge.description && (
                          <div className="text-sm text-neutral-600 mt-1 line-clamp-2">
                            {challenge.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {challenge.topic ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                          {challenge.topic}
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-sm">No topic</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600">
                      {format(new Date(challenge.date_assigned), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-600">
                      {challenge.due_date ? format(new Date(challenge.due_date), 'MMM dd, yyyy') : 'No due date'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-primary-900 font-medium">{results.length}</span>
                    </td>
                    <td className="py-4 px-6">
                      {results.length > 0 ? (
                        <span className={`font-medium ${
                          avgChallengeScore >= 80 ? 'text-success-600' :
                          avgChallengeScore >= 60 ? 'text-warning-600' : 'text-error-600'
                        }`}>
                          {avgChallengeScore}%
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-sm">No submissions</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(challenge)}
                          className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                          title="Edit Challenge"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(challenge.challenge_id)}
                          className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                          title="Delete Challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {challenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No challenges found</h3>
          <p className="text-neutral-500 mb-6">Get started by creating your first coding challenge.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
          >
            Create First Challenge
          </button>
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <ChallengeForm
          challenge={editingChallenge}
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
              Are you sure you want to delete this challenge? This action cannot be undone and will remove all associated results.
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