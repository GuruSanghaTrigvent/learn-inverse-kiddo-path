
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  order_number: number;
  points: number;
  video_url: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
}

interface LessonProgress {
  lesson_id: string;
  completed_sections: string[];
  completed_at: string | null;
}

// Helper function to check if a string is a valid UUID
const isValidUUID = (id: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

export const useCourseData = (courseId: string | undefined, selectedStudentId: string | null) => {
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log("Fetching course with ID:", courseId);
        
        let fetchedCourse: Course | null = null;
        let fetchedLessons: Lesson[] = [];
        
        // Only try to fetch from the database if the courseId is a valid UUID
        if (isValidUUID(courseId)) {
          // First try to fetch the course from the database
          const { data: courseData, error: courseError } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .maybeSingle();
            
          if (courseError) {
            console.error("Error fetching course:", courseError);
            // Don't throw an error here, just continue to our hardcoded data
          } else if (courseData) {
            console.log("Found course in database:", courseData);
            
            // If it's the Money Explorers course, override the title and description
            if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248") {
              fetchedCourse = {
                ...courseData,
                title: "Money Explorers!",
                description: "Let's talk about money and work, and how it all makes the world go around"
              };
            } else {
              fetchedCourse = courseData;
            }
            
            // Fetch lessons for this course from database
            const { data: lessonsData, error: lessonsError } = await supabase
              .from("lessons")
              .select("*")
              .eq("course_id", courseId)
              .order("order_number");
              
            if (lessonsError) {
              console.error("Error fetching lessons:", lessonsError);
            } else if (lessonsData && lessonsData.length > 0) {
              console.log("Found database lessons:", lessonsData);
              
              // For Money Explorers course, we'll use our complete hardcoded list since it may not
              // have all the required lessons in the database
              if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248") {
                console.log("Money Explorers course - ignoring database lessons to ensure all required lessons are present");
              } else {
                fetchedLessons = lessonsData;
              }
            }
          }
        }
        
        // If we didn't find the course in the database or if it's not a UUID, 
        // use our hardcoded data for specific course IDs
        if (!fetchedCourse) {
          if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248") {
            console.log("Using hardcoded data for Money Explorers course");
            // Money Explorers course
            fetchedCourse = {
              id: courseId,
              title: "Money Explorers!",
              description: "Let's talk about money and work, and how it all makes the world go around",
              category: "CAREER",
              points: 200  // This will be updated based on lessons
            };
          } else if (courseId === "5f3c9a7e-2d8b-4f5a-9e6c-3d2f1b7e8a9b") {
            // Big Thinkers course 
            fetchedCourse = {
              id: courseId,
              title: "Big Thinkers!",
              description: "Learn to be brave & try new things!",
              category: "MINDSET",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d") {
            // Life Explorers course (formerly Home Helper)
            fetchedCourse = {
              id: courseId,
              title: "Life Explorers!",
              description: "Cooking, Cleaning & Independence",
              category: "HOME_MAINTENANCE",
              points: 100  // This will be updated based on lessons
            };
          } else if (courseId === "super-thinkers-7-9") {
            // Super Thinkers course
            fetchedCourse = {
              id: courseId,
              title: "Super Thinkers",
              description: "Mindset & Success",
              category: "MINDSET",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "money-adventurers-7-9") {
            // Money Adventurers course
            fetchedCourse = {
              id: courseId,
              title: "Money Adventurers",
              description: "Financial Literacy & Entrepreneurship",
              category: "CAREER",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "future-leaders-7-9") {
            // Future Leaders course
            fetchedCourse = {
              id: courseId,
              title: "Future Leaders",
              description: "Leadership & Communication",
              category: "MINDSET",
              points: 100  // This will be updated based on lessons
            };
          } else if (courseId === "helping-hands-7-9") {
            // Helping Hands course
            fetchedCourse = {
              id: courseId,
              title: "Helping Hands",
              description: "How People Help the World",
              category: "SOCIAL",
              points: 100  // This will be updated based on lessons
            };
          } else if (courseId === "life-superstars-7-9") {
            // Life Superstars course
            fetchedCourse = {
              id: courseId,
              title: "Life Superstars",
              description: "Cooking, Cleaning & Independence",
              category: "HOME_MAINTENANCE",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "mindset-masters-10-12") {
            // Mindset Masters course
            fetchedCourse = {
              id: courseId,
              title: "Mindset Masters",
              description: "Mindset & Success",
              category: "MINDSET",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "money-makers-10-12") {
            // Money Makers course
            fetchedCourse = {
              id: courseId,
              title: "Money Makers",
              description: "Financial Literacy & Entrepreneurship",
              category: "CAREER",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "lead-the-way-10-12") {
            // Lead the Way course
            fetchedCourse = {
              id: courseId,
              title: "Lead the Way",
              description: "Leadership & Communication",
              category: "MINDSET",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "world-of-work-10-12") {
            // The World of Work course
            fetchedCourse = {
              id: courseId,
              title: "The World of Work",
              description: "How People Help the World",
              category: "SOCIAL",
              points: 150  // This will be updated based on lessons
            };
          } else if (courseId === "life-ready-10-12") {
            // Life Ready course
            fetchedCourse = {
              id: courseId,
              title: "Life Ready",
              description: "Cooking, Cleaning & Independence",
              category: "HOME_MAINTENANCE",
              points: 150  // This will be updated based on lessons
            };
          }
        }
        
        if (!fetchedCourse) {
          console.error("Course not found for ID:", courseId);
          setCourse(null);
          setLessons([]);
          setIsLoading(false);
          return;
        }
        
        setCourse(fetchedCourse);
        
        // For the Money Explorers course, ALWAYS use our hardcoded lessons to ensure consistency
        if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248") {
          console.log("Adding default lessons for Money Explorers course");
          
          // Create the complete set of Money Explorers lessons
          fetchedLessons = [
            {
              id: "b1c349e6-505e-4423-8a7d-9f25c715b5e2",
              title: "What is Money?",
              description: "Learn about what money is and how we use it!",
              order_number: 1,
              video_url: null,
              points: 50
            },
            {
              id: "568bf1e1-0f99-4fea-a9d4-cba50b82c9a3",
              title: "What is Work?",
              description: "Learn about different jobs and what working means!",
              order_number: 2,
              video_url: null,
              points: 50
            },
            {
              id: "c72a4f5b-6d8e-9f1a-2b3c-4d5e6f7a8b9c",
              title: "Wants vs. Needs",
              description: "Learn the difference between things we want and things we need!",
              order_number: 3,
              video_url: null,
              points: 50
            },
            {
              id: "d83b5g6c-7e9f-0g2b-3h4i-5j6k7l8m9n0p",
              title: "Starting Your Business",
              description: "Learn how to start your very own business!",
              order_number: 4,
              video_url: null,
              points: 50
            }
          ];
        }
        
        // Add default lessons based on course ID if we don't have any lessons yet
        if (fetchedLessons.length === 0) {
          // Super Thinkers
          if (courseId === "super-thinkers-7-9") {
            console.log("Adding default lessons for Super Thinkers");
            fetchedLessons = [
              {
                id: "st01-your-brain-muscle",
                title: "Your Brain is a Muscle – Grow It!",
                description: "Learn how your brain grows stronger with practice and challenges!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "st02-secret-to-winning",
                title: "The Secret to Winning – Doing the Work!",
                description: "Discover how effort and practice lead to success!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "st03-problems-business-ideas",
                title: "Problems = Business Ideas!",
                description: "Learn how to turn everyday problems into great business ideas!",
                order_number: 3,
                video_url: null,
                points: 50
              }
            ];
          }
          // Money Adventurers
          else if (courseId === "money-adventurers-7-9") {
            console.log("Adding default lessons for Money Adventurers");
            fetchedLessons = [
              {
                id: "ma01-what-is-money",
                title: "What is Money, Really?",
                description: "Discover the true purpose of money and how it works in our world!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "ma02-active-passive-income",
                title: "Active vs. Passive Income",
                description: "Learn the difference between working for money and having money work for you!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "ma03-first-business",
                title: "Starting Your First Business!",
                description: "Learn the steps to create your very own first business!",
                order_number: 3,
                video_url: null,
                points: 50
              }
            ];
          }
          // Future Leaders
          else if (courseId === "future-leaders-7-9") {
            console.log("Adding default lessons for Future Leaders");
            fetchedLessons = [
              {
                id: "fl01-talk-so-people-listen",
                title: "How to Talk So People Listen",
                description: "Learn the secrets of effective communication and public speaking!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "fl02-secret-to-making-friends",
                title: "The Secret to Making Friends",
                description: "Discover how to build strong friendships and connect with others!",
                order_number: 2,
                video_url: null,
                points: 50
              }
            ];
          }
          // Helping Hands
          else if (courseId === "helping-hands-7-9") {
            console.log("Adding default lessons for Helping Hands");
            fetchedLessons = [
              {
                id: "hh01-what-do-workers-do",
                title: "What Do Workers Do?",
                description: "Learn about different jobs and how they help our community!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "hh02-helping-in-community",
                title: "Helping In The Community",
                description: "Discover ways you can help make your community better!",
                order_number: 2,
                video_url: null,
                points: 50
              }
            ];
          }
          // Life Superstars
          else if (courseId === "life-superstars-7-9") {
            console.log("Adding default lessons for Life Superstars");
            fetchedLessons = [
              {
                id: "ls01-make-breakfast",
                title: "How to Make Breakfast!",
                description: "Learn to make delicious and nutritious breakfast meals safely!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "ls02-cleaning-like-pro",
                title: "Cleaning Like a Pro",
                description: "Master the skills of keeping your spaces clean and organized!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "ls03-fixing-things",
                title: "Fixing Things!",
                description: "Learn basic repair skills to fix common household problems!",
                order_number: 3,
                video_url: null,
                points: 50
              }
            ];
          }
          // Lead the Way
          else if (courseId === "lead-the-way-10-12") {
            console.log("Adding default lessons for Lead the Way");
            fetchedLessons = [
              {
                id: "lw01-leadership-styles",
                title: "Understanding Leadership Styles",
                description: "Learn about different ways to lead and when to use each approach!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "lw02-communication",
                title: "Effective Communication",
                description: "Master the art of clear communication with friends, family, and teams!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "lw03-team-building",
                title: "Building Great Teams",
                description: "Learn how to bring people together and create successful teams!",
                order_number: 3,
                video_url: null,
                points: 50
              },
              {
                id: "lw04-likable",
                title: "How to Be Instantly Likable",
                description: "Discover the secrets to making a great first impression and connecting with others!",
                order_number: 4,
                video_url: null,
                points: 50
              },
              {
                id: "lw05-arguments",
                title: "How to Win Any Argument (Without Fighting!)",
                description: "Learn how to express your ideas and resolve disagreements in a positive way!",
                order_number: 5,
                video_url: null,
                points: 50
              }
            ];
          }
          // The World of Work
          else if (courseId === "world-of-work-10-12") {
            console.log("Adding default lessons for The World of Work");
            fetchedLessons = [
              {
                id: "ww01-career-exploration",
                title: "Exploring Different Careers",
                description: "Discover the wide variety of jobs and careers available in today's world!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "ww02-workplace-skills",
                title: "Essential Workplace Skills",
                description: "Learn the key skills that make someone successful in any job!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "ww03-problem-solving",
                title: "Creative Problem Solving",
                description: "Master techniques to solve problems creatively in any situation!",
                order_number: 3,
                video_url: null,
                points: 50
              }
            ];
          }
          // Life Ready
          else if (courseId === "life-ready-10-12") {
            console.log("Adding default lessons for Life Ready");
            fetchedLessons = [
              {
                id: "lr01-meal-planning",
                title: "Meal Planning and Prep",
                description: "Learn how to plan and prepare healthy meals for yourself and others!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "lr02-household-management",
                title: "Household Management",
                description: "Master the skills of keeping a clean, organized, and well-run home!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "lr03-basic-repairs",
                title: "Basic Home Repairs",
                description: "Learn how to fix common household problems safely and effectively!",
                order_number: 3,
                video_url: null,
                points: 50
              }
            ];
          }
          // Money Makers
          else if (courseId === "money-makers-10-12") {
            console.log("Adding default lessons for Money Makers");
            fetchedLessons = [
              {
                id: "mm01-active-passive-income",
                title: "Active vs. Passive Income",
                description: "Learn the difference between working for money and having money work for you!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "mm02-compound-interest",
                title: "The Secret of Compound Interest",
                description: "Discover how your money can grow exponentially over time!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "mm03-401k",
                title: "What is a 401k & Why Should You Care?",
                description: "Learn about retirement accounts and why starting early is important!",
                order_number: 3,
                video_url: null,
                points: 50
              },
              {
                id: "mm04-resume",
                title: "What is a Resume?",
                description: "Learn how to create a resume that showcases your skills and experience!",
                order_number: 4,
                video_url: null,
                points: 50
              }
            ];
          }
          
          // For older course IDs, keep the existing logic
          if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248" && (!fetchedLessons || fetchedLessons.length === 0)) {
            // Create default lessons for Money Explorers - adding the requested lessons
            fetchedLessons = [
              {
                id: "b1c349e6-505e-4423-8a7d-9f25c715b5e2",
                title: "What is Money?",
                description: "Learn about what money is and how we use it!",
                order_number: 1,
                video_url: null,
                points: 50
              },
              {
                id: "568bf1e1-0f99-4fea-a9d4-cba50b82c9a3",
                title: "What is Work?",
                description: "Learn about different jobs and what working means!",
                order_number: 2,
                video_url: null,
                points: 50
              },
              {
                id: "c72a4f5b-6d8e-9f1a-2b3c-4d5e6f7a8b9c",
                title: "Wants vs. Needs",
                description: "Learn the difference between things we want and things we need!",
                order_number: 3,
                video_url: null,
                points: 50
              },
              {
                id: "d83b5g6c-7e9f-0g2b-3h4i-5j6k7l8m9n0p",
                title: "Starting Your Business",
                description: "Learn how to start your very own business!",
                order_number: 4,
                video_url: null,
                points: 50
              }
            ];
          } else if (courseId === "fe6a6e85-bf43-4386-a204-de6481be7248" && fetchedLessons.length < 4) {
            // If we have some lessons but not all, add the missing ones for Money Explorers
            const existingLessons = fetchedLessons.map(lesson => lesson.title);
            
            // Add "What is Money?" if missing
            if (!existingLessons.includes("What is Money?")) {
              fetchedLessons.push({
                id: "b1c349e6-505e-4423-8a7d-9f25c715b5e2",
                title: "What is Money?",
                description: "Learn about what money is and how we use it!",
                order_number: existingLessons.length + 1,
                video_url: null,
                points: 50
              });
            }
            
            // Add "What is Work?" if missing
            if (!existingLessons.includes("What is Work?")) {
              fetchedLessons.push({
                id: "568bf1e1-0f99-4fea-a9d4-cba50b82c9a3",
                title: "What is Work?",
                description: "Learn about different jobs and what working means!",
                order_number: existingLessons.length + 1,
                video_url: null,
                points: 50
              });
            }
            
            // Add "Wants vs. Needs" if missing
            if (!existingLessons.includes("Wants vs. Needs")) {
              fetchedLessons.push({
                id: "c72a4f5b-6d8e-9f1a-2b3c-4d5e6f7a8b9c",
                title: "Wants vs. Needs",
                description: "Learn the difference between things we want and things we need!",
                order_number: existingLessons.length + 1,
                video_url: null,
                points: 50
              });
            }
            
            // Add "Starting Your Business" if missing
            if (!existingLessons.includes("Starting Your Business")) {
              fetchedLessons.push({
                id: "d83b5g6c-7e9f-0g2b-3h4i-5j6k7l8m9n0p",
                title: "Starting Your Business",
                description: "Learn how to start your very own business!",
                order_number: existingLessons.length + 1,
                video_url: null,
                points: 50
              });
            }
            
            // Sort by order_number
            fetchedLessons.sort((a, b) => a.order_number - b.order_number);
          }
          
          // Add default lessons for the Big Thinkers course
          if (courseId === "5f3c9a7e-2d8b-4f5a-9e6c-3d2f1b7e8a9b" && (!fetchedLessons || fetchedLessons.length < 3)) {
            // Create default lessons for Big Thinkers if none found
            const bigThinkersLessons = [
              ...fetchedLessons,
            ];
            
            // Check if we have the "Your Brain is a Superpower!" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "Your Brain is a Superpower!")) {
              bigThinkersLessons.push({
                id: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
                title: "Your Brain is a Superpower!",
                description: "Discover how amazing your brain is and what it can do!",
                order_number: 1,
                video_url: null,
                points: 50
              });
            }
            
            // Check if we have the "Trying is Winning 🏆" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "Trying is Winning 🏆")) {
              bigThinkersLessons.push({
                id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
                title: "Trying is Winning 🏆",
                description: "Learn why making an effort is already a big success!",
                order_number: 2,
                video_url: null,
                points: 50
              });
            }
            
            // Check if we have the "The Magic of Setting Goals" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "The Magic of Setting Goals")) {
              bigThinkersLessons.push({
                id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
                title: "The Magic of Setting Goals",
                description: "Learn how to set goals and make them happen!",
                order_number: 3,
                video_url: null,
                points: 50
              });
            }
            
            // Sort by order_number
            fetchedLessons = bigThinkersLessons.sort((a, b) => a.order_number - b.order_number);
          }
          
          // Add default lessons for the Life Explorers course
          if (courseId === "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d" && (!fetchedLessons || fetchedLessons.length < 3)) {
            // Create default lessons for Life Explorers if none found
            const lifeExplorersLessons = [
              ...fetchedLessons,
            ];
            
            // Check if we have the "Making a Snack" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "Making a Snack")) {
              lifeExplorersLessons.push({
                id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
                title: "Making a Snack",
                description: "Learn how to make simple, tasty snacks safely!",
                order_number: 1,
                video_url: null,
                points: 35
              });
            }
            
            // Check if we have the "Keeping My Space Clean" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "Keeping My Space Clean")) {
              lifeExplorersLessons.push({
                id: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
                title: "Keeping My Space Clean",
                description: "Learn how to organize and tidy up your room!",
                order_number: 2,
                video_url: null,
                points: 30
              });
            }
            
            // Check if we have the "Getting Ready Like a Pro" lesson
            if (!fetchedLessons.some(lesson => lesson.title === "Getting Ready Like a Pro")) {
              lifeExplorersLessons.push({
                id: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
                title: "Getting Ready Like a Pro",
                description: "Learn morning and evening routines for independence!",
                order_number: 3,
                video_url: null,
                points: 35
              });
            }
            
            // Sort by order_number
            fetchedLessons = lifeExplorersLessons.sort((a, b) => a.order_number - b.order_number);
          }
        }
        
        console.log("Final lessons for course:", fetchedLessons);
        
        // Set the lessons and update course points
        setLessons(fetchedLessons);
        
        // Calculate total course points from lessons
        const totalPoints = fetchedLessons.reduce((sum, lesson) => sum + (lesson.points || 0), 0);
        
        // Update the course with correct total points
        if (fetchedCourse) {
          fetchedCourse.points = totalPoints;
          setCourse(fetchedCourse);
          
          // If this course is from the database and has a valid UUID, update its points
          if (isValidUUID(courseId)) {
            try {
              await supabase
                .from("courses")
                .update({ points: totalPoints })
                .eq("id", courseId);
              
              console.log("Updated course points in database to:", totalPoints);
            } catch (error) {
              console.error("Error updating course points:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchCourse:", error);
        toast({
          title: "Error",
          description: "Failed to fetch course details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedStudentId || !courseId) return;

      try {
        const { data: progressData, error: progressError } = await supabase
          .from("student_progress")
          .select("*")
          .eq("student_id", selectedStudentId);

        if (progressError) {
          throw progressError;
        }

        const progressMap: Record<string, LessonProgress> = {};
        progressData.forEach((p) => {
          progressMap[p.lesson_id] = {
            lesson_id: p.lesson_id,
            completed_sections: p.completed_sections,
            completed_at: p.completed_at,
          };
        });

        setProgress(progressMap);
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast({
          title: "Error",
          description: "Failed to fetch progress",
          variant: "destructive",
        });
      }
    };

    fetchProgress();
  }, [selectedStudentId, courseId, toast]);

  const getLessonProgress = (lessonId: string): number => {
    const lessonProgress = progress[lessonId];
    if (!lessonProgress || !lessonProgress.completed_sections) return 0;
    return (lessonProgress.completed_sections.length / 4) * 100;
  };

  return {
    course,
    lessons,
    progress,
    currentSectionIndex,
    setCurrentSectionIndex,
    getLessonProgress,
    isLoading
  };
};
