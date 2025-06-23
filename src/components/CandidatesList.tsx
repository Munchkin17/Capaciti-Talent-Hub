import React, { useState } from 'react';
import { Search, Filter, Eye, User } from 'lucide-react';
import { mockCandidates, mockCohorts } from '../data/mockData';
import { CandidateCard } from './CandidateCard';

interface CandidatesListProps {
  onViewProfile: (candidateId: string) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCohort = !selectedCohort || candidate.cohortId === selectedCohort;
    const matchesVisibility = !showPublicOnly || candidate.isPublic;
    
    return matchesSearch && matchesCohort && matchesVisibility;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Management</h2>
          <p className="text-gray-600">Manage candidate profiles and visibility settings.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          Add New Candidate
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Cohorts</option>
                {mockCohorts.map(cohort => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showPublicOnly}
                onChange={(e) => setShowPublicOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">Public only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};