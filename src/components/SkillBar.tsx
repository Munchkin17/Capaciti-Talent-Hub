import React from 'react';
import { Skill } from '../types';

interface SkillBarProps {
  skill: Skill;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  const percentage = (skill.level / skill.maxLevel) * 100;
  const stars = Math.round((skill.level / skill.maxLevel) * 5);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-primary-900">{skill.name}</span>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  star <= stars 
                    ? 'bg-gradient-to-r from-secondary-600 to-secondary-700' 
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-600 font-medium">{skill.level}%</span>
        </div>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-secondary-500 to-accent-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};