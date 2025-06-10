
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCurrentStudent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    const fetchStudentId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/register");
        return;
      }

      const { data: students, error } = await supabase
        .from("students")
        .select("id, first_name")
        .eq("parent_id", session.user.id)
        .limit(1);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch student data",
          variant: "destructive",
        });
        return;
      }

      if (students && students.length > 0) {
        setSelectedStudentId(students[0].id);
        setStudentName(students[0].first_name);
      }
    };

    fetchStudentId();
  }, [navigate, toast]);

  return {
    selectedStudentId,
    studentName,
  };
};
