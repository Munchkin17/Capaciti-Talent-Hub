import React, { useState } from 'react';
import { Search, Filter, Globe, ExternalLink, Star } from 'lucide-react';
import { mockCandidates, mockCohorts, generateCandidateProfile } from '../data/mockData';

interface TalentDirectoryProps {
  onViewProfile: (candidateId: string) => void;
}

export const TalentDirectory: React.FC<TalentDirectoryProps> = ({ onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  const publicCandidates = mockCandidates.filter(candidate => candidate.isPublic);
  const roles = Array.from(new Set(publicCandidates.map(c => c.role)));
  
  const filteredCandidates = publicCandidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || candidate.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Talent Directory</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover exceptional talent from our coding bootcamps and training programs. 
          These candidates are ready to contribute to your team.
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="sm:w-48 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => {
          const profile = generateCandidateProfile(candidate.id);
          const cohort = mockCohorts.find(c => c.id === candidate.cohortId);
          
          return (
            <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {candidate.photoUrl ? (
                    <img 
                      src={candidate.photoUrl} 
                      alt={candidate.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.fullName}</h3>
                    <p className="text-gray-600">{candidate.role}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm text-gray-600">{profile?.overallRating.toFixed(1)}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Program:</span> {cohort?.programName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Cohort:</span> {cohort?.name}
                  </p>
                </div>

                {profile && profile.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 3).map(skill => (
                        <span 
                          key={skill.name}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  {candidate.linkedinUrl && (
                    <a 
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {candidate.githubUrl && (
                    <a 
                      href={candidate.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {candidate.portfolioUrl && (
                    <a 
                      href={candidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => onViewProfile(candidate.id)}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No public profiles found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
        </div>
      )}
    </div>
  );
};