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
  Mail,
  Clock,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CandidateProfile as CandidateProfileType } from '../../types';
import { format } from 'date-fns';
import { SkillBar } from '../SkillBar';
import { PerformanceChart } from '../PerformanceChart';

interface PublicCandidateProfileProps {
  profile: CandidateProfileType;
  onBack: () => void;
}

export const PublicCandidateProfile: React.FC<PublicCandidateProfileProps> = ({ profile, onBack }) => {
  const [technicalFeedback, setTechnicalFeedback] = React.useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = React.useState(true);

  React.useEffect(() => {
    loadTechnicalFeedback();
  }, [profile.id]);

  const loadTechnicalFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('technical_feedback')
        .select('*')
        .eq('candidate_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTechnicalFeedback(data || []);
    } catch (err) {
      console.error('Error loading technical feedback:', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const passedExams = profile.exams.filter(exam => exam.result === 'Passed');
  const avgChallengeScore = profile.challengeResults.length > 0 
    ? Math.round(profile.challengeResults.reduce((sum, cr) => sum + cr.score, 0) / profile.challengeResults.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Directory</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-success-600 bg-success-50 px-4 py-2 rounded-full border border-success-200">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Available for hire</span>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-900 via-secondary-700 to-accent-600 p-10 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{profile.fullName}</h1>
              <p className="text-2xl text-white/90 mb-4 font-semibold">{profile.role}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Graduated: {profile.cohort.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-current text-accent-300" />
                  <span className="font-medium">{profile.overallRating.toFixed(1)}/5.0 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Available immediately</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {profile.linkedinUrl && (
                <a 
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-4 py-3 rounded-lg text-sm hover:bg-white/30 transition-colors font-medium"
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
                  className="flex items-center space-x-2 bg-white/20 px-4 py-3 rounded-lg text-sm hover:bg-white/30 transition-colors font-medium"
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
                  className="flex items-center space-x-2 bg-white/20 px-4 py-3 rounded-lg text-sm hover:bg-white/30 transition-colors font-medium"
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
                  className="flex items-center space-x-2 bg-white/20 px-4 py-3 rounded-lg text-sm hover:bg-white/30 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-accent-50 to-neutral-100 rounded-2xl p-8 border border-accent-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Interested in hiring {profile.fullName.split(' ')[0]}?</h3>
            <p className="text-neutral-600">Get in touch to discuss opportunities and availability through CAPACITI TALENT HUB.</p>
          </div>
          <div className="flex space-x-4">
            <a
              href={`mailto:${profile.email}?subject=Job Opportunity via CAPACITI TALENT HUB - ${profile.role}`}
              className="flex items-center space-x-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-xl font-bold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Candidate</span>
            </a>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
        <h2 className="text-xl font-bold text-primary-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-secondary-600" />
          <span>Professional Summary</span>
        </h2>
        <p className="text-neutral-700 leading-relaxed text-lg">{profile.aiSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6">Technical Skills</h3>
          <div className="space-y-6">
            {profile.skills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6">Performance Highlights</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200">
                <div className="text-3xl font-bold text-secondary-700">{avgChallengeScore}%</div>
                <div className="text-sm text-neutral-600 font-medium">Avg Challenge Score</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl border border-success-200">
                <div className="text-3xl font-bold text-success-700">{passedExams.length}</div>
                <div className="text-sm text-neutral-600 font-medium">Exams Passed</div>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-200">
              <div className="text-3xl font-bold text-accent-700">{profile.overallRating.toFixed(1)}/5.0</div>
              <div className="text-sm text-neutral-600 font-medium">Team Leader Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Feedback Section */}
      {!loadingFeedback && technicalFeedback.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-secondary-600" />
            <span>Technical Mentor Feedback</span>
          </h3>
          
          <div className="space-y-6">
            {technicalFeedback.map((feedback) => (
              <div key={feedback.feedback_id} className="border border-neutral-200 rounded-xl p-6 bg-gradient-to-br from-neutral-50 to-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-900">{feedback.mentor_name}</h4>
                      <p className="text-sm text-neutral-600">
                        {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {feedback.feedback_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Chart */}
      {profile.challengeResults.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6">Learning Progress</h3>
          <PerformanceChart challengeResults={profile.challengeResults} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Certifications & Achievements */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6 text-accent-600" />
            <span>Certifications & Achievements</span>
          </h3>
          
          <div className="space-y-4">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-primary-900">{cert.certName}</h4>
                  {cert.certUrl && (
                    <a 
                      href={cert.certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-600 hover:text-secondary-700"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span className="font-medium">{cert.provider}</span>
                  <span>{format(cert.issueDate, 'MMM yyyy')}</span>
                </div>
              </div>
            ))}
            
            {profile.exams.filter(exam => exam.result === 'Passed').map((exam) => (
              <div key={exam.id} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-primary-900">{exam.examName}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-700 border border-success-200">
                    Passed
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span className="font-medium">Score: {Math.round((exam.score / exam.maxScore) * 100)}%</span>
                  <span>{format(exam.dateTaken, 'MMM yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center space-x-2">
            <Users className="w-6 h-6 text-secondary-600" />
            <span>Program Details</span>
          </h3>
          
          <div className="space-y-6">
            <div className="border border-neutral-200 rounded-xl p-6 bg-gradient-to-br from-neutral-50 to-white">
              <h4 className="font-bold text-primary-900 mb-4">{profile.cohort.programName}</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Cohort:</span>
                  <span className="font-bold text-primary-900">{profile.cohort.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Duration:</span>
                  <span className="font-medium">{format(profile.cohort.startDate, 'MMM yyyy')} - {format(profile.cohort.endDate, 'MMM yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Cohort Size:</span>
                  <span className="font-medium">{profile.cohort.candidateCount} students</span>
                </div>
              </div>
            </div>

            {profile.surveys.length > 0 && (
              <div className="border border-neutral-200 rounded-xl p-6">
                <h4 className="font-bold text-primary-900 mb-4">Team Leader Feedback</h4>
                {profile.surveys.slice(0, 2).map((survey) => (
                  <div key={survey.id} className="mb-4 last:mb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-accent-500" />
                        <span className="text-sm font-bold">{survey.rating}/5</span>
                      </div>
                      <span className="text-xs text-neutral-500 capitalize font-medium">{survey.surveyType}</span>
                    </div>
                    <p className="text-sm text-neutral-700 italic leading-relaxed">"{survey.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects & Events */}
      {profile.events.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
          <h3 className="text-xl font-bold text-primary-900 mb-6 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-secondary-600" />
            <span>Projects & Events</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.events.map((event) => (
              <div key={event.id} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-primary-900">{event.eventName}</h4>
                  {event.resourcesUrl && (
                    <a 
                      href={event.resourcesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-600 hover:text-secondary-700"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span className="font-bold text-accent-600">{event.role}</span>
                  <span>{format(event.date, 'MMM yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};