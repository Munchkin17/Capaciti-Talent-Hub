import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Linkedin, Github, Globe, FileText, Camera, Award } from 'lucide-react';
import { candidateService, cohortService } from '../../../services/adminService';
import type { Database } from '../../../lib/supabase';

type Candidate = Database['public']['Tables']['candidates']['Row'];
type CandidateInsert = Database['public']['Tables']['candidates']['Insert'];
type Cohort = Database['public']['Tables']['cohorts']['Row'];

interface CandidateFormProps {
  candidate?: Candidate;
  onClose: () => void;
  onSave: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ candidate, onClose, onSave }) => {
  const [formData, setFormData] = useState<CandidateInsert>({
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    resume_url: '',
    photo_url: '',
    role: '',
    skill_level: undefined,
    is_public: false
  });
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setFormData({
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone || '',
        linkedin_url: candidate.linkedin_url || '',
        github_url: candidate.github_url || '',
        portfolio_url: candidate.portfolio_url || '',
        resume_url: candidate.resume_url || '',
        photo_url: candidate.photo_url || '',
        role: candidate.role || '',
        skill_level: candidate.skill_level,
        is_public: candidate.is_public
      });
    }
    loadCohorts();
  }, [candidate]);

  const loadCohorts = async () => {
    try {
      const data = await cohortService.getAll();
      setCohorts(data);
    } catch (err) {
      console.error('Error loading cohorts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (candidate) {
        await candidateService.update(candidate.candidate_id, formData);
      } else {
        const newCandidate = await candidateService.create(formData);
        
        // Assign to selected cohorts
        for (const cohortId of selectedCohorts) {
          await candidateService.assignToCohort(newCandidate.candidate_id, cohortId);
        }
      }
      
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CandidateInsert, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900">
              {candidate ? 'Edit Candidate' : 'Add New Candidate'}
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
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                  placeholder="e.g., Full-Stack Developer, Data Analyst"
                />
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary-900 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Skill Assessment</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Skill Level
              </label>
              <select
                value={formData.skill_level || ''}
                onChange={(e) => handleInputChange('skill_level', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
              >
                <option value="">Select skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary-900 flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Online Presence</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => handleInputChange('github_url', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Portfolio Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Resume URL
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.resume_url}
                    onChange={(e) => handleInputChange('resume_url', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Photo URL
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => handleInputChange('photo_url', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Assignment (for new candidates) */}
          {!candidate && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">
                Cohort Assignment
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Cohorts
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-neutral-300 rounded-lg p-3">
                  {cohorts.map((cohort) => (
                    <label key={cohort.cohort_id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCohorts.includes(cohort.cohort_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCohorts(prev => [...prev, cohort.cohort_id]);
                          } else {
                            setSelectedCohorts(prev => prev.filter(id => id !== cohort.cohort_id));
                          }
                        }}
                        className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
                      />
                      <span className="text-sm text-neutral-700">
                        {cohort.cohort_name} - {cohort.program_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Visibility Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary-900">
              Visibility Settings
            </h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => handleInputChange('is_public', e.target.checked)}
                className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
              />
              <label htmlFor="is_public" className="text-sm font-medium text-neutral-700">
                Make profile public (visible in talent directory)
              </label>
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
              <span>{loading ? 'Saving...' : candidate ? 'Update Candidate' : 'Create Candidate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};