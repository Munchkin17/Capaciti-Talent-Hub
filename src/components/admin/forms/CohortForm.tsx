import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, BookOpen } from 'lucide-react';
import { cohortService } from '../../../services/adminService';
import type { Database } from '../../../lib/supabase';

type Cohort = Database['public']['Tables']['cohorts']['Row'];
type CohortInsert = Database['public']['Tables']['cohorts']['Insert'];

interface CohortFormProps {
  cohort?: Cohort;
  onClose: () => void;
  onSave: () => void;
}

export const CohortForm: React.FC<CohortFormProps> = ({ cohort, onClose, onSave }) => {
  const [formData, setFormData] = useState<CohortInsert>({
    cohort_name: '',
    start_date: '',
    end_date: '',
    program_name: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cohort) {
      setFormData({
        cohort_name: cohort.cohort_name,
        start_date: cohort.start_date,
        end_date: cohort.end_date,
        program_name: cohort.program_name || '',
        notes: cohort.notes || ''
      });
    }
  }, [cohort]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (cohort) {
        await cohortService.update(cohort.cohort_id, formData);
      } else {
        await cohortService.create(formData);
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CohortInsert, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const programOptions = [
    'Full-Stack Development Bootcamp',
    'Data Science & Analytics',
    'UX/UI Design Intensive',
    'DevOps Engineering',
    'Mobile App Development',
    'Cybersecurity Fundamentals',
    'Cloud Computing Essentials',
    'AI & Machine Learning'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900">
              {cohort ? 'Edit Cohort' : 'Add New Cohort'}
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

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary-900 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Cohort Information</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cohort Name *
                </label>
                <input
                  type="text"
                  value={formData.cohort_name}
                  onChange={(e) => handleInputChange('cohort_name', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  placeholder="e.g., Tech Accelerator 2025-Q2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Program Name *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <select
                    value={formData.program_name}
                    onChange={(e) => handleInputChange('program_name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select a program</option>
                    {programOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  placeholder="Additional information about this cohort..."
                />
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
              <span>{loading ? 'Saving...' : cohort ? 'Update Cohort' : 'Create Cohort'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};