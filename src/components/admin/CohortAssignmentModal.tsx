import React, { useState, useEffect } from 'react';
import { X, Save, Users, Calendar } from 'lucide-react';
import { candidateService, cohortService } from '../../services/adminService';
import type { Database } from '../../lib/supabase';

type Candidate = Database['public']['Tables']['candidates']['Row'];
type Cohort = Database['public']['Tables']['cohorts']['Row'];

interface CohortAssignmentModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSave: () => void;
}

export const CohortAssignmentModal: React.FC<CohortAssignmentModalProps> = ({ 
  candidate, 
  onClose, 
  onSave 
}) => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [currentCohorts, setCurrentCohorts] = useState<string[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [candidate.candidate_id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all cohorts
      const cohortsData = await cohortService.getAll();
      setCohorts(cohortsData);
      
      // Load candidate's current cohort assignments
      const { data: candidateData } = await supabase
        .from('candidate_cohorts')
        .select('cohort_id')
        .eq('candidate_id', candidate.candidate_id);
      
      const currentCohortIds = candidateData?.map(cc => cc.cohort_id) || [];
      setCurrentCohorts(currentCohortIds);
      setSelectedCohorts(currentCohortIds);
      
    } catch (err) {
      setError('Failed to load cohort data');
      console.error('Error loading cohort data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove from cohorts that are no longer selected
      const cohortsToRemove = currentCohorts.filter(cohortId => !selectedCohorts.includes(cohortId));
      for (const cohortId of cohortsToRemove) {
        await candidateService.removeFromCohort(candidate.candidate_id, cohortId);
      }
      
      // Add to newly selected cohorts
      const cohortsToAdd = selectedCohorts.filter(cohortId => !currentCohorts.includes(cohortId));
      for (const cohortId of cohortsToAdd) {
        await candidateService.assignToCohort(candidate.candidate_id, cohortId);
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cohort assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCohortToggle = (cohortId: string) => {
    setSelectedCohorts(prev => 
      prev.includes(cohortId)
        ? prev.filter(id => id !== cohortId)
        : [...prev, cohortId]
    );
  };

  const getStatusInfo = (cohort: Cohort) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary-900">Manage Cohort Assignments</h2>
              <p className="text-neutral-600 mt-1">{candidate.full_name}</p>
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

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Available Cohorts</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Select the cohorts this candidate should be assigned to. A candidate can be in multiple cohorts.
                </p>
              </div>

              <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
                {cohorts.map((cohort) => {
                  const statusInfo = getStatusInfo(cohort);
                  const isSelected = selectedCohorts.includes(cohort.cohort_id);
                  
                  return (
                    <label 
                      key={cohort.cohort_id} 
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-secondary-600 bg-secondary-50' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCohortToggle(cohort.cohort_id)}
                        className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500 mr-4"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary-900">{cohort.cohort_name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-neutral-600 mb-2">{cohort.program_name}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {cohorts.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No cohorts available</h3>
                  <p className="text-neutral-500">Create cohorts first before assigning candidates.</p>
                </div>
              )}

              {/* Summary */}
              {selectedCohorts.length > 0 && (
                <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-secondary-900 mb-2">Assignment Summary</h4>
                  <p className="text-sm text-secondary-700">
                    {candidate.full_name} will be assigned to {selectedCohorts.length} cohort{selectedCohorts.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}

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
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 font-medium disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Update Assignments'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};