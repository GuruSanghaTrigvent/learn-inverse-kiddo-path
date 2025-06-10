
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types/student";

const SELECTED_STUDENT_KEY = "selectedStudentId";

export const useStudentData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem(SELECTED_STUDENT_KEY);
  });
  const [studentName, setStudentName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  // Persist selected student ID to localStorage when it changes
  useEffect(() => {
    if (selectedStudentId) {
      localStorage.setItem(SELECTED_STUDENT_KEY, selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate("/register");
          return;
        }

        const { data: studentsData, error } = await supabase
          .from("students")
          .select("*")
          .eq("parent_id", session.session.user.id);

        if (error) {
          console.error("Error fetching students:", error);
          toast({
            title: "Error",
            description: "Failed to fetch students",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched students:", studentsData);

        const studentsWithDefaults = studentsData?.map(student => {
          const defaultProgress = {
            MINDSET: 0,
            HOME_MAINTENANCE: 0,
            COOKING: 0,
            CAREER: 0,
            SOCIAL: 0
          };
          
          return {
            ...student,
            points: student.points || 0,
            course_progress: student.course_progress || defaultProgress,
            // Ensure age_group is included in the student data
            age_group: student.age_group || 'GROUP_7_9'
          };
        }) || [];

        setStudents(studentsWithDefaults);

        // Only set the selected student if we don't already have one from localStorage
        // or if the selected student isn't in the fetched students list
        const storedStudentId = localStorage.getItem(SELECTED_STUDENT_KEY);
        
        if (studentsWithDefaults.length > 0) {
          if (!storedStudentId) {
            // No stored student ID, select the first one
            setSelectedStudentId(studentsWithDefaults[0].id);
            setStudentName(`${studentsWithDefaults[0].first_name} ${studentsWithDefaults[0].last_name}`);
          } else {
            // Check if the stored student ID exists in our fetched data
            const selectedStudent = studentsWithDefaults.find(s => s.id === storedStudentId);
            if (selectedStudent) {
              // The stored student exists, update the student name without changing selection
              setStudentName(`${selectedStudent.first_name} ${selectedStudent.last_name}`);
            } else {
              // The stored student no longer exists, default to the first one
              setSelectedStudentId(studentsWithDefaults[0].id);
              setStudentName(`${studentsWithDefaults[0].first_name} ${studentsWithDefaults[0].last_name}`);
            }
          }
        }
      } catch (error) {
        console.error("Error in useStudentData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [navigate, toast]);

  // Update DashboardHeader to properly handle student selection change
  const updateSelectedStudent = (id: string | null) => {
    setSelectedStudentId(id);
    if (id) {
      localStorage.setItem(SELECTED_STUDENT_KEY, id);
      const student = students.find(s => s.id === id);
      if (student) {
        setStudentName(`${student.first_name} ${student.last_name}`);
      }
    } else {
      localStorage.removeItem(SELECTED_STUDENT_KEY);
    }
  };

  return {
    selectedStudentId,
    studentName,
    students,
    isLoading,
    setSelectedStudentId: updateSelectedStudent,
    setStudentName,
    setStudents
  };
};
