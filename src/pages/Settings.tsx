
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Volume, 
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [email, setEmail] = useState("");

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <DashboardHeader 
        students={[]} 
        selectedStudent={null} 
        onStudentChange={() => {}}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>
        
        <div className="space-y-8">
          {/* Account Settings */}
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">Account</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#334155] border-0 text-white mt-1"
                />
              </div>
              
              <Button 
                onClick={handleSaveSettings}
                className="bg-primary text-primary-foreground mt-2"
              >
                Save Changes
              </Button>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-white/70" />
                  <Label htmlFor="notifications" className="text-white">Notifications</Label>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume className="h-5 w-5 text-white/70" />
                  <Label htmlFor="sound" className="text-white">Sound Effects</Label>
                </div>
                <Switch 
                  id="sound" 
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="bg-[#1E293B] rounded-lg p-6 shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">Account Actions</h2>
            <div className="space-y-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
