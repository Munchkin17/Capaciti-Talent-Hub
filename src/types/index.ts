export interface Cohort {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  programName: string;
  candidateCount: number;
  avgPerformance: number;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  cohortId: string;
  role: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  photoUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeResult {
  id: string;
  candidateId: string;
  challengeTitle: string;
  date: Date;
  score: number;
  topic: string;
  maxScore: number;
}

export interface Exam {
  id: string;
  candidateId: string;
  examName: string;
  dateTaken: Date;
  score: number;
  maxScore: number;
  result: 'Passed' | 'Failed' | 'Pending';
}

export interface Certification {
  id: string;
  candidateId: string;
  certName: string;
  provider: string;
  issueDate: Date;
  certUrl?: string;
  expirationDate?: Date;
}

export interface Survey {
  id: string;
  candidateId: string;
  surveyType: 'leadership' | 'collaboration' | 'technical' | 'overall';
  rating: number;
  comment: string;
  date: Date;
  reviewerName: string;
}

export interface Event {
  id: string;
  candidateId: string;
  eventName: string;
  role: string;
  date: Date;
  resourcesUrl?: string;
}

export interface Skill {
  name: string;
  level: number;
  maxLevel: number;
}

export interface CandidateProfile extends Candidate {
  cohort: Cohort;
  skills: Skill[];
  challengeResults: ChallengeResult[];
  exams: Exam[];
  certifications: Certification[];
  surveys: Survey[];
  events: Event[];
  aiSummary: string;
  overallRating: number;
}