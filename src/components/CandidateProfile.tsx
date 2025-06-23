import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Calendar, 
  Award, 
  Users, 
  TrendingUp,
  Download,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { CandidateProfile as CandidateProfileType } from '../types';
import { format } from 'date-fns';
import { SkillBar } from './SkillBar';
import { PerformanceChart } from './PerformanceChart';

interface CandidateProfileProps {
  profile: CandidateProfileType;
  onBack: () => void;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({ profile, onBack }) => {
  const passedExams = profile.exams.filter(exam => exam.result === 'Passed');
  const avgChallengeScore = profile.challengeResults.length > 0 
    ? Math.round(profile.challengeResults.reduce((sum, cr) => sum + cr.score, 0) / profile.challengeResults.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Candidates</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            profile.isPublic 
              ? 'bg-success-100 text-success-700 hover:bg-success-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            {profile.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{profile.isPublic ? 'Public' : 'Private'}</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{profile.fullName}</h1>
              <p className="text-lg text-white/90 mb-3">{profile.role}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span>Cohort: {profile.cohort.name}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-300" />
                  <span>{profile.overallRating.toFixed(1)}/5.0</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.linkedinUrl && (
                <a 
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.githubUrl && (
                <a 
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.portfolioUrl && (
                <a 
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
              {profile.resumeUrl && (
                <a 
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <span>Profile Summary</span>
        </h2>
        <p className="text-gray-700 leading-relaxed">{profile.aiSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Topics Mastered</h3>
          <div className="space-y-4">
            {profile.skills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{avgChallengeScore}%</div>
                <div className="text-sm text-gray-600">Avg Challenge Score</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600">{passedExams.length}</div>
                <div className="text-sm text-gray-600">Exams Passed</div>
              </div>
            </div>
            
            {profile.challengeResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Challenge Results</h4>
                <div className="space-y-2">
                  {profile.challengeResults.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{result.challengeTitle}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.score}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      {profile.challengeResults.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <PerformanceChart challengeResults={profile.challengeResults} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams & Certifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-accent-600" />
            <span>Exams & Certifications</span>
          </h3>
          
          <div className="space-y-4">
            {profile.exams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{exam.examName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.result === 'Passed' 
                      ? 'bg-success-100 text-success-700'
                      : exam.result === 'Failed'
                      ? 'bg-error-100 text-error-700'
                      : 'bg-warning-100 text-warning-700'
                  }`}>
                    {exam.result}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{format(exam.dateTaken, 'MMM dd, yyyy')}</span>
                  <span>{exam.score}/{exam.maxScore} ({Math.round((exam.score / exam.maxScore) * 100)}%)</span>
                </div>
              </div>
            ))}
            
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{cert.certName}</h4>
                  {cert.certUrl && (
                    <a 
                      href={cert.certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{cert.provider}</span>
                  <span>{format(cert.issueDate, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Feedback */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-secondary-600" />
            <span>Team Leader Feedback</span>
          </h3>
          
          <div className="space-y-4">
            {profile.surveys.map((survey) => (
              <div key={survey.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize font-medium text-gray-900">{survey.surveyType}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{survey.rating}/5</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{format(survey.date, 'MMM dd, yyyy')}</span>
                </div>
                <p className="text-gray-700 text-sm italic mb-2">"{survey.comment}"</p>
                <p className="text-xs text-gray-500">— {survey.reviewerName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events & Projects */}
      {profile.events.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <span>Events & Projects</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{event.eventName}</h4>
                  {event.resourcesUrl && (
                    <a 
                      href={event.resourcesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">{event.role}</span>
                  <span>{format(event.date, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};