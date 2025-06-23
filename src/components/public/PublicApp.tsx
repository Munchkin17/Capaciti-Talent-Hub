import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicTalentDirectory } from './PublicTalentDirectory';
import { PublicCandidateProfile } from './PublicCandidateProfile';
import { candidateService } from '../../services/adminService';
import { transformSupabaseCandidateToCandidateProfile } from '../../utils/dataTransformers';
import type { CandidateProfile } from '../../types';

interface PublicAppProps {
  onBackToHome: () => void;
}

export const PublicApp: React.FC<PublicAppProps> = ({ onBackToHome }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewProfile = async (candidateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const candidateData = await candidateService.getById(candidateId);
      
      if (candidateData && candidateData.is_public) {
        const profile = transformSupabaseCandidateToCandidateProfile(candidateData);
        setSelectedCandidateProfile(profile);
        setSelectedCandidateId(candidateId);
      } else {
        setError('Candidate profile not found or not public');
      }
    } catch (err) {
      console.error('Error fetching candidate profile:', err);
      setError('Failed to load candidate profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDirectory = () => {
    setSelectedCandidateId(null);
    setSelectedCandidateProfile(null);
    setError(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            {error}
          </div>
          <button
            onClick={handleBackToDirectory}
            className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium"
          >
            ← Back to Directory
          </button>
        </div>
      );
    }

    if (selectedCandidateId && selectedCandidateProfile) {
      return (
        <PublicCandidateProfile 
          profile={selectedCandidateProfile} 
          onBack={handleBackToDirectory} 
        />
      );
    }

    return <PublicTalentDirectory onViewProfile={handleViewProfile} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader onBackToHome={onBackToHome} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};