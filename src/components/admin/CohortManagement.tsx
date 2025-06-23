import React, { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp, Edit, Trash2, Download } from 'lucide-react';
import { useCohortsWithCandidates } from '../../hooks/useSupabaseData';
import { cohortService, dataService } from '../../services/adminService';
import { CohortForm } from './forms/CohortForm';
import { format } from 'date-fns';

export const CohortManagement: React.FC = () => {
  const { data: cohorts, loading, error, refetch } = useCohortsWithCandidates();
  const [showForm, setShowForm] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (cohort: any) => {
    setEditingCohort(cohort);
    setShowForm(true);
  };

  const handleDelete = async (cohortId: string) => {
    try {
      await cohortService.delete(cohortId);
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting cohort:', err);
    }
  };

  const handleExport = async () => {
    try {
      const { csv, filename } = await dataService.exportCohorts();
      dataService.downloadCSV(csv, filename);
    } catch (err) {
      console.error('Error exporting cohorts:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCohort(null);
  };

  const handleFormSave = () => {
    refetch();
  };

  const getStatusInfo = (cohort: any) => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = new Date(cohort.end_date);
    
    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-warning-100 text-warning-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-success-100 text-success-700' };
    } else {
      return { status: 'Completed', color: 'bg-neutral-100 text-neutral-700' };
    }
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
        Error loading cohorts: {error}
      </div>
    );
  }

  const totalCandidates = cohorts.reduce((sum, cohort) => 
    sum + (cohort.candidate_cohorts?.length || 0), 0
  );
  const activeCohorts = cohorts.filter(cohort => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = new Date(cohort.end_date);
    return now >= startDate && now <= endDate;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Cohort Management</h2>
          <p className="text-neutral-600">Manage training cohorts and track program progress.</p>
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
            <span>Add Cohort</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Cohorts</p>
              <p className="text-2xl font-bold text-primary-900">{cohorts.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Active Cohorts</p>
              <p className="text-2xl font-bold text-success-600">{activeCohorts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Total Candidates</p>
              <p className="text-2xl font-bold text-secondary-600">{totalCandidates}</p>
            </div>
            <Users className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">Avg Cohort Size</p>
              <p className="text-2xl font-bold text-accent-600">
                {cohorts.length > 0 ? Math.round(totalCandidates / cohorts.length) : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-600" />
          </div>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cohorts.map((cohort) => {
          const statusInfo = getStatusInfo(cohort);
          const candidateCount = cohort.candidate_cohorts?.length || 0;
          
          return (
            <div key={cohort.cohort_id} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-primary-900 mb-1">{cohort.cohort_name}</h4>
                  <p className="text-neutral-600 text-sm mb-2">{cohort.program_name}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.status}
                  </span>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(cohort)}
                    className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                    title="Edit Cohort"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cohort.cohort_id)}
                    className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    title="Delete Cohort"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(cohort.start_date), 'MMM dd')} - {format(new Date(cohort.end_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Users className="w-4 h-4" />
                  <span>{candidateCount} candidate{candidateCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {cohort.notes && (
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-700">{cohort.notes}</p>
                </div>
              )}

              {candidateCount > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">Recent Candidates</h5>
                  <div className="space-y-1">
                    {cohort.candidate_cohorts?.slice(0, 3).map((cc: any) => (
                      <div key={cc.candidate_id} className="text-xs text-neutral-600">
                        {cc.candidates.full_name} - {cc.candidates.role || 'No role specified'}
                      </div>
                    ))}
                    {candidateCount > 3 && (
                      <div className="text-xs text-neutral-500">
                        +{candidateCount - 3} more candidate{candidateCount - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {cohorts.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No cohorts found</h3>
          <p className="text-neutral-500 mb-6">Get started by creating your first training cohort.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300"
          >
            Create First Cohort
          </button>
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <CohortForm
          cohort={editingCohort}
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
              Are you sure you want to delete this cohort? This action cannot be undone and will remove all candidate assignments.
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