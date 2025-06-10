
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coins } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  description: string | null;
  points: number;
  progress: number;
}

export const LessonHeader = ({
  title,
  description,
  points,
  progress
}: LessonHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <Button variant="outline" className="space-x-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span>{points} coins</span>
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
