
import { AgeGroup } from "@/types/student";

export const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getAgeGroup = (birthday: string): AgeGroup => {
  const age = calculateAge(birthday);
  
  if (age <= 6) return 'GROUP_5_6';
  if (age <= 9) return 'GROUP_7_9';
  return 'GROUP_10_12';
};

export const isValidAge = (birthday: string): boolean => {
  const age = calculateAge(birthday);
  return age >= 5 && age <= 12;
};
