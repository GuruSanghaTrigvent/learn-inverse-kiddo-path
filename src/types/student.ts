
export type AgeGroup = 'GROUP_5_6' | 'GROUP_7_9' | 'GROUP_10_12';

export interface Student {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  age_group: AgeGroup;
  avatar_url?: string;
  created_at: string;
  course_progress: {
    MINDSET: number;
    HOME_MAINTENANCE: number;
    COOKING: number;
    CAREER: number;
    SOCIAL: number;
  };
  points: number;
}
