import React, { useState, useEffect } from 'react';
import { Search, Filter, Globe, ExternalLink, Star, Clock, Award, TrendingUp } from 'lucide-react';
import { useCandidatesWithCohorts } from '../../hooks/useSupabaseData';
import { cohortService } from '../../services/adminService';
import { transformSupabaseCandidateToCandidate, generateSkillsFromChallengeResults } from '../../utils/dataTransformers';
import type { Database } from '../../lib/supabase';

interface PublicTalentDirectoryProps {
  onViewProfile: (candidateId: string) => void;
}

type SupabaseCandidate = Database['public']['Tables']['candidates']['Row'] & {
  candidate_cohorts?: Array<{
    cohort_id: string;
    enrollment_date?: string;
    completion_status?: string;
    cohorts: Database['public']['Tables']['cohorts']['Row'];
  }>;
};

export const PublicTalentDirectory: React.FC<PublicTalentDirectoryProps> = ({ onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [cohorts, setCohorts] = useState<Database['public']['Tables']['cohorts']['Row'][]>([]);
  
  const { data: supabaseCandidates, loading, error } = useCandidatesWithCohorts();
  
  // Load cohorts for filtering
  useEffect(() => {
    const loadCohorts = async () => {
      try {
        const cohortsData = await cohortService.getAll();
        setCohorts(cohortsData);
      } catch (err) {
        console.error('Error loading cohorts:', err);
      }
    };
    loadCohorts();
  }, []);

  // Filter to only public candidates
  const publicCandidates = supabaseCandidates.filter((candidate: SupabaseCandidate) => candidate.is_public);
  
  // Transform candidates for UI
  const candidates = publicCandidates.map(transformSupabaseCandidateToCandidate);
  
  // Get unique roles for filtering
  const roles = Array.from(new Set(candidates.map(c => c.role).filter(Boolean)));
  
  const filteredCandidates = candidates.filter(candidate => {
    const supabaseCandidate = publicCandidates.find(sc => sc.candidate_id === candidate.id);
    
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || candidate.role === selectedRole;
    const matchesSkillLevel = !selectedSkillLevel || supabaseCandidate?.skill_level === selectedSkillLevel;
    
    return matchesSearch && matchesRole && matchesSkillLevel;
  });

  const getSkillLevelBadge = (skillLevel: string | null | undefined) => {
    if (!skillLevel) return null;
    
    const badges = {
      beginner: 'bg-warning-100 text-warning-700 border-warning-200',
      intermediate: 'bg-secondary-100 text-secondary-700 border-secondary-200',
      advanced: 'bg-success-100 text-success-700 border-success-200'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badges[skillLevel as keyof typeof badges]}`}>
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-3xl p-12 border border-neutral-200">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4">
            CAPACITI TALENT HUB
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6 leading-tight">
          Discover Exceptional
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-500">
            Verified Talent
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Browse our curated directory of skilled professionals ready to contribute to your team. 
          All candidates have completed intensive training programs with verified skills and certifications.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full border border-neutral-200">
            <Clock className="w-4 h-4 text-success-600" />
            <span className="text-neutral-700 font-medium">Ready to start immediately</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full border border-neutral-200">
            <Star className="w-4 h-4 text-accent-600" />
            <span className="text-neutral-700 font-medium">Verified skills & certifications</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full border border-neutral-200">
            <Globe className="w-4 h-4 text-secondary-600" />
            <span className="text-neutral-700 font-medium">Remote-ready professionals</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, role, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48 relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-12 pr-8 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:w-48 relative">
              <select
                value={selectedSkillLevel}
                onChange={(e) => setSelectedSkillLevel(e.target.value)}
                className="w-full px-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-secondary-600 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-neutral-600 font-medium">
            <span className="text-primary-900 font-bold">{filteredCandidates.length}</span> candidates found
          </span>
          <div className="flex items-center space-x-4">
            <button className="text-neutral-600 hover:text-primary-900 font-medium transition-colors">Sort by relevance</button>
            <button className="text-neutral-600 hover:text-primary-900 font-medium transition-colors">Sort by experience</button>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCandidates.map(candidate => {
          const supabaseCandidate = publicCandidates.find(sc => sc.candidate_id === candidate.id);
          const cohort = supabaseCandidate?.candidate_cohorts?.[0]?.cohorts;
          
          return (
            <div key={candidate.id} className="group bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  {candidate.photoUrl ? (
                    <img 
                      src={candidate.photoUrl} 
                      alt={candidate.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-accent-100 rounded-full flex items-center justify-center border-2 border-neutral-200">
                      <span className="text-xl font-bold text-primary-900">
                        {candidate.fullName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900">{candidate.fullName}</h3>
                    <p className="text-secondary-600 font-semibold">{candidate.role}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-current text-accent-500" />
                      <span className="text-sm text-neutral-600 font-medium">4.5/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold text-primary-900">Program:</span> {cohort?.program_name || 'Unknown Program'}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold text-primary-900">Graduated:</span> {cohort?.cohort_name || 'Unknown Cohort'}
                  </p>
                  {supabaseCandidate?.skill_level && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-primary-900">Skill Level:</span>
                      {getSkillLevelBadge(supabaseCandidate.skill_level)}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-primary-900 mb-3">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Show skills based on role */}
                    {candidate.role.toLowerCase().includes('developer') && (
                      <>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          JavaScript
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          React
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          Node.js
                        </span>
                      </>
                    )}
                    {candidate.role.toLowerCase().includes('data') && (
                      <>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          Python
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          SQL
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          Data Analysis
                        </span>
                      </>
                    )}
                    {candidate.role.toLowerCase().includes('frontend') && (
                      <>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          HTML/CSS
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          JavaScript
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          React
                        </span>
                      </>
                    )}
                    {!candidate.role.toLowerCase().includes('developer') && 
                     !candidate.role.toLowerCase().includes('data') && 
                     !candidate.role.toLowerCase().includes('frontend') && (
                      <>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          Problem Solving
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 rounded-full text-xs font-semibold">
                          Team Work
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {candidate.linkedinUrl && (
                      <a 
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-secondary-600 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {candidate.githubUrl && (
                      <a 
                        href={candidate.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-secondary-600 transition-colors"
                        title="GitHub Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {candidate.portfolioUrl && (
                      <a 
                        href={candidate.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-secondary-600 transition-colors"
                        title="Portfolio Website"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-success-600 bg-success-50 px-3 py-1 rounded-full border border-success-200">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Available</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewProfile(candidate.id)}
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-4 rounded-xl text-sm font-bold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform group-hover:scale-105 shadow-lg"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-primary-900 mb-4">No candidates found</h3>
          <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
            Try adjusting your search criteria or filters. Our talent pool is constantly growing, 
            so check back soon for new additions to the CAPACITI TALENT HUB.
          </p>
        </div>
      )}
    </div>
  );
};