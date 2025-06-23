import { Cohort, Candidate, ChallengeResult, Exam, Certification, Survey, Event, CandidateProfile } from '../types';

export const mockCohorts: Cohort[] = [
  {
    id: '1',
    name: 'Tech Accelerator 2025-Q1',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-04-15'),
    programName: 'Full-Stack Development Bootcamp',
    candidateCount: 24,
    avgPerformance: 87
  },
  {
    id: '2',
    name: 'Data Science Intensive 2025-Q1',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-05-01'),
    programName: 'Data Science & Analytics',
    candidateCount: 18,
    avgPerformance: 91
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    cohortId: '1',
    role: 'Full-Stack Developer',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    githubUrl: 'https://github.com/sarahjohnson',
    portfolioUrl: 'https://sarahjohnson.dev',
    resumeUrl: 'https://example.com/resume-sarah.pdf',
    photoUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPublic: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-03-15')
  },
  {
    id: '2',
    fullName: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    cohortId: '1',
    role: 'Frontend Developer',
    linkedinUrl: 'https://linkedin.com/in/marcuschen',
    githubUrl: 'https://github.com/marcuschen',
    portfolioUrl: 'https://marcuschen.dev',
    photoUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPublic: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-03-15')
  },
  {
    id: '3',
    fullName: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    cohortId: '2',
    role: 'Data Analyst',
    linkedinUrl: 'https://linkedin.com/in/emmarodriguez',
    githubUrl: 'https://github.com/emmarodriguez',
    photoUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPublic: false,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-03-15')
  }
];

export const mockChallengeResults: ChallengeResult[] = [
  { id: '1', candidateId: '1', challengeTitle: 'Python Basics', date: new Date('2025-01-20'), score: 85, topic: 'Python', maxScore: 100 },
  { id: '2', candidateId: '1', challengeTitle: 'SQL Queries', date: new Date('2025-01-27'), score: 78, topic: 'SQL', maxScore: 100 },
  { id: '3', candidateId: '1', challengeTitle: 'Web Development', date: new Date('2025-02-03'), score: 92, topic: 'HTML/CSS', maxScore: 100 },
  { id: '4', candidateId: '1', challengeTitle: 'React Components', date: new Date('2025-02-10'), score: 88, topic: 'React', maxScore: 100 },
  { id: '5', candidateId: '2', challengeTitle: 'JavaScript Fundamentals', date: new Date('2025-01-22'), score: 91, topic: 'JavaScript', maxScore: 100 },
  { id: '6', candidateId: '2', challengeTitle: 'Frontend Framework', date: new Date('2025-02-05'), score: 94, topic: 'React', maxScore: 100 }
];

export const mockExams: Exam[] = [
  { id: '1', candidateId: '1', examName: 'Final Technical Exam', dateTaken: new Date('2025-03-15'), score: 88, maxScore: 100, result: 'Passed' },
  { id: '2', candidateId: '1', examName: 'SQL Certification Exam', dateTaken: new Date('2025-02-28'), score: 82, maxScore: 100, result: 'Passed' },
  { id: '3', candidateId: '2', examName: 'Frontend Assessment', dateTaken: new Date('2025-03-10'), score: 95, maxScore: 100, result: 'Passed' }
];

export const mockCertifications: Certification[] = [
  { 
    id: '1', 
    candidateId: '1', 
    certName: 'Google Data Analytics Certificate', 
    provider: 'Google', 
    issueDate: new Date('2025-02-15'),
    certUrl: 'https://example.com/cert1.pdf'
  },
  { 
    id: '2', 
    candidateId: '1', 
    certName: 'AWS Cloud Practitioner', 
    provider: 'Amazon Web Services', 
    issueDate: new Date('2025-03-01'),
    certUrl: 'https://example.com/cert2.pdf'
  }
];

export const mockSurveys: Survey[] = [
  { 
    id: '1', 
    candidateId: '1', 
    surveyType: 'leadership', 
    rating: 4.7, 
    comment: 'Sarah demonstrated excellent leadership skills during group projects and consistently supported her peers.',
    date: new Date('2025-03-01'),
    reviewerName: 'Team Leader Johnson'
  },
  { 
    id: '2', 
    candidateId: '1', 
    surveyType: 'collaboration', 
    rating: 4.9, 
    comment: 'Outstanding team player with great communication skills. Always willing to help others.',
    date: new Date('2025-03-01'),
    reviewerName: 'Team Leader Johnson'
  },
  { 
    id: '3', 
    candidateId: '2', 
    surveyType: 'technical', 
    rating: 4.8, 
    comment: 'Strong technical skills and quick learner. Excellent problem-solving abilities.',
    date: new Date('2025-03-05'),
    reviewerName: 'Senior Developer Smith'
  }
];

export const mockEvents: Event[] = [
  { 
    id: '1', 
    candidateId: '1', 
    eventName: 'Spring Hackathon 2025', 
    role: 'Team Lead', 
    date: new Date('2025-02-20'),
    resourcesUrl: 'https://example.com/hackathon-project'
  },
  { 
    id: '2', 
    candidateId: '1', 
    eventName: 'Tech Talk: Modern Web Development', 
    role: 'Attendee', 
    date: new Date('2025-02-15')
  },
  { 
    id: '3', 
    candidateId: '2', 
    eventName: 'UI/UX Design Workshop', 
    role: 'Participant', 
    date: new Date('2025-02-18')
  }
];

export const generateCandidateProfile = (candidateId: string): CandidateProfile | null => {
  const candidate = mockCandidates.find(c => c.id === candidateId);
  if (!candidate) return null;

  const cohort = mockCohorts.find(c => c.id === candidate.cohortId)!;
  const challengeResults = mockChallengeResults.filter(cr => cr.candidateId === candidateId);
  const exams = mockExams.filter(e => e.candidateId === candidateId);
  const certifications = mockCertifications.filter(c => c.candidateId === candidateId);
  const surveys = mockSurveys.filter(s => s.candidateId === candidateId);
  const events = mockEvents.filter(e => e.candidateId === candidateId);

  // Generate skills based on challenge results
  const skillMap = new Map<string, { total: number, count: number, max: number }>();
  challengeResults.forEach(cr => {
    if (!skillMap.has(cr.topic)) {
      skillMap.set(cr.topic, { total: 0, count: 0, max: 0 });
    }
    const skill = skillMap.get(cr.topic)!;
    skill.total += cr.score;
    skill.count += 1;
    skill.max = Math.max(skill.max, cr.maxScore);
  });

  const skills = Array.from(skillMap.entries()).map(([name, data]) => ({
    name,
    level: Math.round(data.total / data.count),
    maxLevel: data.max
  }));

  // Add some additional skills
  if (candidateId === '1') {
    skills.push(
      { name: 'Git & GitHub', level: 85, maxLevel: 100 },
      { name: 'Agile & Scrum', level: 75, maxLevel: 100 },
      { name: 'Leadership & Collaboration', level: 88, maxLevel: 100 }
    );
  } else if (candidateId === '2') {
    skills.push(
      { name: 'Git & GitHub', level: 90, maxLevel: 100 },
      { name: 'UI/UX Design', level: 85, maxLevel: 100 },
      { name: 'Team Collaboration', level: 92, maxLevel: 100 }
    );
  }

  const overallRating = surveys.length > 0 ? 
    surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length : 4.5;

  const aiSummary = candidateId === '1' ? 
    "Sarah has successfully completed the Tech Career Accelerator program, showing strong skills in Python, Web Development, and Leadership. She excelled in teamwork and problem-solving, consistently performing well in daily challenges and team evaluations. She demonstrated leadership in the Spring Hackathon 2025, and holds certifications in Google Data Analytics and AWS Cloud Practitioner." :
    "Marcus has demonstrated exceptional technical skills throughout the program, with particular strength in JavaScript and React development. His collaborative approach and design sensibility make him a valuable team member, with consistently high performance across all assessments.";

  return {
    ...candidate,
    cohort,
    skills,
    challengeResults,
    exams,
    certifications,
    surveys,
    events,
    aiSummary,
    overallRating
  };
};