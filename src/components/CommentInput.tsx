import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";

interface CommentInputProps {
  onAnalyze: (comments: string[]) => void;
}

const CommentInput = ({ onAnalyze }: CommentInputProps) => {
  const [singleComment, setSingleComment] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSingleCommentAnalysis = () => {
    if (!singleComment.trim()) {
      toast.error("Please enter a comment to analyze");
      return;
    }
    
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      onAnalyze([singleComment]);
      setIsAnalyzing(false);
      toast.success("Comment analyzed successfully");
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Simple CSV parsing - assumes one comment per line
      const comments = content.split('\n').filter(line => line.trim());
      
      setIsAnalyzing(true);
      setTimeout(() => {
        onAnalyze(comments);
        setIsAnalyzing(false);
        toast.success(`${comments.length} comments uploaded and analyzed`);
      }, 2000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Single Comment Analysis</span>
          </CardTitle>
          <CardDescription>
            Enter a single comment for immediate sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter stakeholder comment here..."
            value={singleComment}
            onChange={(e) => setSingleComment(e.target.value)}
            rows={6}
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleSingleCommentAnalysis}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Comment"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Bulk Upload Analysis</span>
          </CardTitle>
          <CardDescription>
            Upload a CSV file with multiple comments for batch analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV files only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
            </label>
          </div>
          {isAnalyzing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Processing file...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentInput;