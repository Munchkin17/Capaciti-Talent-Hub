import React from 'react';
import { Users, TrendingUp, Award, Calendar, FileText } from 'lucide-react';
import { useCandidatesWithCohorts, useCohortsWithCandidates } from '../hooks/useSupabaseData';
import { StatsCard } from './StatsCard';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { data: candidates, loading: candidatesLoading } = useCandidatesWithCohorts();
  const { data: cohorts, loading: cohortsLoading } = useCohortsWithCandidates();

  const loading = candidatesLoading || cohortsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  const totalCandidates = candidates.length;
  const publicProfiles = candidates.filter(c => c.is_public).length;
  const activeCohorts = cohorts.filter(cohort => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = new Date(cohort.end_date);
    return now >= startDate && now <= endDate;
  }).length;

  const skillLevelStats = {
    beginner: candidates.filter(c => c.skill_level === 'beginner').length,
    intermediate: candidates.filter(c => c.skill_level === 'intermediate').length,
    advanced: candidates.filter(c => c.skill_level === 'advanced').length
  };

  const recentCandidates = candidates
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingCohorts = cohorts
    .filter(cohort => new Date(cohort.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">Dashboard Overview</h2>
        <p className="text-neutral-600">Monitor cohort performance and candidate progress at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Candidates"
          value={totalCandidates.toString()}
          icon={Users}
          trend="+12%"
          trendUp={true}
          color="primary"
        />
        <StatsCard
          title="Public Profiles"
          value={publicProfiles.toString()}
          icon={TrendingUp}
          trend="+8%"
          trendUp={true}
          color="success"
        />
        <StatsCard
          title="Active Cohorts"
          value={activeCohorts.toString()}
          icon={Calendar}
          trend="0%"
          trendUp={false}
          color="secondary"
        />
        <StatsCard
          title="Advanced Level"
          value={skillLevelStats.advanced.toString()}
          icon={Award}
          trend="+15%"
          trendUp={true}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Recent Candidates</span>
          </h3>
          
          <div className="space-y-4">
            {recentCandidates.map((candidate) => (
              <div key={candidate.candidate_id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
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
                <div className="flex-1">
                  <div className="font-medium text-primary-900">{candidate.full_name}</div>
                  <div className="text-sm text-neutral-600 flex items-center space-x-2">
                    <span>{candidate.role || 'No role specified'}</span>
                    {candidate.skill_level && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.skill_level === 'advanced' ? 'bg-success-100 text-success-700' :
                        candidate.skill_level === 'intermediate' ? 'bg-secondary-100 text-secondary-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                        {candidate.skill_level}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  {format(new Date(candidate.created_at), 'MMM dd')}
                </div>
              </div>
            ))}
            
            {recentCandidates.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                No candidates added yet
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Cohorts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Upcoming Cohorts</span>
          </h3>
          
          <div className="space-y-4">
            {upcomingCohorts.map((cohort) => (
              <div key={cohort.cohort_id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-primary-900">{cohort.cohort_name}</h4>
                  <span className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded-full font-medium">
                    Upcoming
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{cohort.program_name}</p>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Starts: {format(new Date(cohort.start_date), 'MMM dd, yyyy')}</span>
                  <span>{cohort.candidate_cohorts?.length || 0} candidates</span>
                </div>
              </div>
            ))}
            
            {upcomingCohorts.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                No upcoming cohorts scheduled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skill Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-warning-600" />
            <div>
              <h4 className="font-semibold text-primary-900">Beginner Level</h4>
              <p className="text-sm text-neutral-600">Entry-level candidates</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Total:</span>
              <span className="font-medium text-primary-900">{skillLevelStats.beginner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Public:</span>
              <span className="font-medium text-primary-900">
                {candidates.filter(c => c.skill_level === 'beginner' && c.is_public).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-secondary-600" />
            <div>
              <h4 className="font-semibold text-primary-900">Intermediate Level</h4>
              <p className="text-sm text-neutral-600">Developing skills</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Total:</span>
              <span className="font-medium text-primary-900">{skillLevelStats.intermediate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Public:</span>
              <span className="font-medium text-primary-900">
                {candidates.filter(c => c.skill_level === 'intermediate' && c.is_public).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-success-600" />
            <div>
              <h4 className="font-semibold text-primary-900">Advanced Level</h4>
              <p className="text-sm text-neutral-600">Expert-level candidates</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Total:</span>
              <span className="font-medium text-primary-900">{skillLevelStats.advanced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Public:</span>
              <span className="font-medium text-primary-900">
                {candidates.filter(c => c.skill_level === 'advanced' && c.is_public).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Platform Insights</h3>
            <p className="text-neutral-600 mb-4">
              Your platform is performing well with {totalCandidates} candidates across {cohorts.length} cohorts. 
              {publicProfiles > 0 && ` ${publicProfiles} profiles are publicly visible in the talent directory.`}
              {skillLevelStats.advanced > 0 && ` ${skillLevelStats.advanced} candidates have reached advanced skill level.`}
            </p>
            <button className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300">
              View Detailed Analytics
            </button>
          </div>
          <div className="hidden lg:block">
            <TrendingUp className="w-16 h-16 text-primary-400" />
          </div>
        </div>
      </div>
    </div>
  );
};