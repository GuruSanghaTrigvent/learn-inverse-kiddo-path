
import { Button } from "@/components/ui/button";
import { UserPlus, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";

interface DashboardHeaderProps {
  students: Student[];
  selectedStudent: Student | null;
  onStudentChange: (student: Student) => void;
}

export const DashboardHeader = ({
  students,
  selectedStudent,
  onStudentChange,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear selected student from localStorage on logout
    localStorage.removeItem("selectedStudentId");
    navigate("/");
  };

  // Make sure we're using the value from localStorage rather than defaulting
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const student = students.find((s) => s.id === e.target.value);
    if (student) {
      onStudentChange(student);
      localStorage.setItem("selectedStudentId", student.id);
    }
  };

  return (
    <header className="bg-[#1E293B]/80 backdrop-blur-sm shadow-lg border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              onClick={() => navigate("/dashboard")}
              className="text-2xl font-bold bg-gradient-to-r from-[#FFD93D] to-[#F8B500] bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            >
              HoneyLearn
            </h1>
            {students.length > 0 && (
              <select
                className="form-select rounded-md bg-[#334155] border-0 text-white"
                onChange={handleStudentChange}
                value={selectedStudent?.id || ""}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={() => navigate("/add-student")}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Child
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
