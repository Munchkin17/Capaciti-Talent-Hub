import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Users, Sparkles, Download, Upload, MessageSquare, UserPlus } from 'lucide-react';
import { useCandidatesWithCohorts } from '../../hooks/useSupabaseData';
import { candidateService, dataService } from '../../services/adminService';
import { CandidateForm } from './forms/CandidateForm';
import { TechnicalFeedbackModal } from './TechnicalFeedbackModal';
import { CohortAssignmentModal } from './CohortAssignmentModal';
import { ImportDataModal } from './ImportDataModal';
import { format } from 'date-fns';

export const CandidateManagement: React.FC = () => {
  const { data: candidates, loading, error, refetch } = useCandidatesWithCohorts();
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublic, setFilterPublic] = useState<'all' | 'public' | 'private'>('all');
  const [filterSkillLevel, setFilterSkillLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (candidate.role && candidate.role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterPublic === 'all' || 
                         (filterPublic === 'public' && candidate.is_public) ||
                         (filterPublic === 'private' && !candidate.is_public);
    
    const matchesSkillLevel = filterSkillLevel === 'all' || candidate.skill_level === filterSkillLevel;
    
    return matchesSearch && matchesFilter && matchesSkillLevel;
  });

  const handleEdit = (candidate: any) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDelete = async (candidateId: string) => {
    try {
      await candidateService.delete(candidateId);
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  const handleGenerateAI = async (candidateId: string) => {
    try {
      await candidateService.generateAIProfile(candidateId);
      refetch();
    } catch (err) {
      console.error('Error generating AI profile:', err);
    }
  };

  const handleExport = async () => {
    try {
      const { csv, filename } = await dataService.exportCandidates();
      dataService.downloadCSV(csv, filename);
    } catch (err) {
      console.error('Error exporting candidates:', err);
    }
  };

  const handleTechnicalFeedback = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setShowFeedbackModal(true);
  };

  const handleCohortAssignment = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowCohortModal(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleFormSave = () => {
    refetch();
  };

  const getSkillLevelBadge = (skillLevel: string | null) => {
    if (!skillLevel) return null;
    
    const badges = {
      beginner: 'bg-warning-100 text-warning-700 border-warning-200',
      intermediate: 'bg-secondary-100 text-secondary-700 border-secondary-200',
      advanced: 'bg-success-100 text-success-700 border-success-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badges[skillLevel as keyof typeof badges]}`}>
        {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
      </span>
    );
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
        Error loading candidates: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Candidate Management</h2>
          <p className="text-neutral-600">Manage candidate profiles, assignments, and visibility settings.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
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
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Candidates</p>
              <p className="text-2xl font-bold text-primary-900">{candidates.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Beginner</p>
              <p className="text-2xl font-bold text-warning-600">
                {candidates.filter(c => c.skill_level === 'beginner').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-warning-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Intermediate</p>
              <p className="text-2xl font-bold text-secondary-600">
                {candidates.filter(c => c.skill_level === 'intermediate').length}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Advanced</p>
              <p className="text-2xl font-bold text-success-600">
                {candidates.filter(c => c.skill_level === 'advanced').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-success-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Public Profiles</p>
              <p className="text-2xl font-bold text-accent-600">
                {candidates.filter(c => c.is_public).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-accent-600" />
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
              placeholder="Search candidates by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <select
                value={filterPublic}
                onChange={(e) => setFilterPublic(e.target.value as 'all' | 'public' | 'private')}
                className="pl-9 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Candidates</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={filterSkillLevel}
                onChange={(e) => setFilterSkillLevel(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-neutral-600">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Candidate</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Skill Level</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Cohort</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-900">Created</th>
                <th className="text-right py-4 px-6 font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.candidate_id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {candidate.photo_url ? (
                        <img 
                          src={candidate.photo_url} 
                          alt={candidate.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-900">
                            {candidate.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-primary-900">{candidate.full_name}</div>
                        <div className="text-sm text-neutral-600">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-neutral-900">{candidate.role || 'Not specified'}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getSkillLevelBadge(candidate.skill_level)}
                  </td>
                  <td className="py-4 px-6">
                    {candidate.candidate_cohorts && candidate.candidate_cohorts.length > 0 ? (
                      <div className="space-y-1">
                        {candidate.candidate_cohorts.map((cc: any) => (
                          <div key={cc.cohort_id} className="text-sm">
                            <span className="font-medium text-primary-900">{cc.cohorts.cohort_name}</span>
                            <div className="text-xs text-neutral-600">{cc.cohorts.program_name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-sm">No cohort assigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.is_public 
                          ? 'bg-success-100 text-success-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {candidate.is_public ? 'Public' : 'Private'}
                      </span>
                      {candidate.profile_summary && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                          AI Profile
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {format(new Date(candidate.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleCohortAssignment(candidate)}
                        className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                        title="Manage Cohort Assignment"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTechnicalFeedback(candidate.candidate_id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Technical Feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {!candidate.profile_summary && (
                        <button
                          onClick={() => handleGenerateAI(candidate.candidate_id)}
                          className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                          title="Generate AI Profile"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="Edit Candidate"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(candidate.candidate_id)}
                        className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete Candidate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No candidates found</h3>
          <p className="text-neutral-500 mb-6">
            {searchTerm || filterPublic !== 'all' || filterSkillLevel !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first candidate.'
            }
          </p>
          {!searchTerm && filterPublic === 'all' && filterSkillLevel === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
            >
              Add First Candidate
            </button>
          )}
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <CandidateForm
          candidate={editingCandidate}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {showImportModal && (
        <ImportDataModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={refetch}
        />
      )}

      {showFeedbackModal && selectedCandidateId && (
        <TechnicalFeedbackModal
          candidateId={selectedCandidateId}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedCandidateId(null);
          }}
        />
      )}

      {showCohortModal && selectedCandidate && (
        <CohortAssignmentModal
          candidate={selectedCandidate}
          onClose={() => {
            setShowCohortModal(false);
            setSelectedCandidate(null);
          }}
          onSave={() => {
            refetch();
            setShowCohortModal(false);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Confirm Deletion</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this candidate? This action cannot be undone and will remove all associated data.
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