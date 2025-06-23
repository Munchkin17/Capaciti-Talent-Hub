import React from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { Cohort } from '../types';
import { format } from 'date-fns';

interface CohortCardProps {
  cohort: Cohort;
}

export const CohortCard: React.FC<CohortCardProps> = ({ cohort }) => {
  const isActive = new Date() >= cohort.startDate && new Date() <= cohort.endDate;
  const progress = isActive ? 
    Math.round(((new Date().getTime() - cohort.startDate.getTime()) / 
    (cohort.endDate.getTime() - cohort.startDate.getTime())) * 100) : 
    new Date() > cohort.endDate ? 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">{cohort.name}</h4>
          <p className="text-gray-600 text-sm">{cohort.programName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-success-100 text-success-700' 
            : new Date() > cohort.endDate 
              ? 'bg-gray-100 text-gray-700'
              : 'bg-warning-100 text-warning-700'
        }`}>
          {isActive ? 'Active' : new Date() > cohort.endDate ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(cohort.startDate, 'MMM dd')} - {format(cohort.endDate, 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{cohort.candidateCount} candidates</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{cohort.avgPerformance}% avg performance</span>
        </div>
      </div>

      {isActive && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};