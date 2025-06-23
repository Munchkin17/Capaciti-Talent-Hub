import React from 'react';
import { Eye, ExternalLink, Globe, Users } from 'lucide-react';
import type { Database } from '../lib/supabase';
import { format } from 'date-fns';

type SupabaseCandidate = Database['public']['Tables']['candidates']['Row'] & {
  candidate_cohorts?: Array<{
    cohort_id: string;
    enrollment_date?: string;
    completion_status?: string;
    cohorts: Database['public']['Tables']['cohorts']['Row'];
  }>;
};

interface CandidateCardProps {
  candidate: SupabaseCandidate;
  onViewProfile: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewProfile }) => {
  const cohort = candidate.candidate_cohorts?.[0]?.cohorts;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {candidate.photo_url ? (
            <img 
              src={candidate.photo_url} 
              alt={candidate.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name}</h3>
            <p className="text-sm text-gray-600">{candidate.role || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {candidate.is_public && (
            <div className="flex items-center space-x-1 text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">
              <Globe className="w-3 h-3" />
              <span>Public</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Cohort:</span> {cohort?.cohort_name || 'No cohort assigned'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Program:</span> {cohort?.program_name || 'Unknown program'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {candidate.email}
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {candidate.linkedin_url && (
          <a 
            href={candidate.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {candidate.github_url && (
          <a 
            href={candidate.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {candidate.portfolio_url && (
          <a 
            href={candidate.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onViewProfile(candidate.candidate_id)}
          className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View Profile</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};