
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getAgeGroup, isValidAge } from "@/utils/ageGroup";
import Footer from "@/components/Footer";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthday: z.string().min(1, "Birthday is required")
});

type StudentFormValues = z.infer<typeof studentSchema>;

const AddStudent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthday: ""
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/register");
      }
    });
  }, [navigate]);

  const formatBirthday = (value: string) => {
    let formattedValue = value.replace(/\D/g, '');
    
    if (formattedValue.length > 8) {
      formattedValue = formattedValue.slice(0, 8);
    }

    if (formattedValue.length >= 4) {
      formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4) + '/' + formattedValue.slice(4);
    } else if (formattedValue.length >= 2) {
      formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
    }

    return formattedValue;
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formattedValue = formatBirthday(e.target.value);
    onChange(formattedValue);
  };

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const birthdayDate = new Date(data.birthday);
      if (isNaN(birthdayDate.getTime())) {
        throw new Error("Please enter a valid date in MM/DD/YYYY format");
      }

      if (!isValidAge(data.birthday)) {
        throw new Error("Student must be between 5 and 12 years old");
      }

      setIsLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Authentication error: " + sessionError.message);
      }
      
      if (!sessionData.session?.user.id) {
        throw new Error("No authenticated user found");
      }

      const ageGroup = getAgeGroup(data.birthday);
      console.log("Creating student with age group:", ageGroup);

      const { data: insertData, error: insertError } = await supabase.from('students').insert({
        parent_id: sessionData.session.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        birthday: new Date(data.birthday).toISOString().split('T')[0],
        age_group: ageGroup,
        course_progress: {
          MINDSET: 0,
          HOME_MAINTENANCE: 0,
          COOKING: 0,
          CAREER: 0,
          SOCIAL: 0
        }
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(insertError.message);
      }

      toast({
        title: "Success!",
        description: "Student added successfully.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Add student error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-gray-400 hover:text-white"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to dashboard
      </Button>

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary transform rotate-45 mb-1"></div>
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-primary transform rotate-45"></div>
                    <div className="w-4 h-4 bg-primary transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Add a student</h1>
            <p className="text-gray-400 text-sm">
              For children between 5 and 12 years old
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          className="bg-secondary/50 border-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          className="bg-secondary/50 border-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Birthday (MM/DD/YYYY)"
                        className="bg-secondary/50 border-0"
                        maxLength={10}
                        {...field}
                        onChange={(e) => handleBirthdayChange(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? "Adding student..." : "Continue"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-gray-400 text-center">
            You can add more students later from the profile switcher.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddStudent;
