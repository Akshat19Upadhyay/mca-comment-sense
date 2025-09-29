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
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <span>Single Comment Analysis</span>
          </CardTitle>
          <CardDescription className="text-base">
            Enter a single comment for immediate sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Enter stakeholder comment here..."
            value={singleComment}
            onChange={(e) => setSingleComment(e.target.value)}
            rows={6}
            className="min-h-[120px] border-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <Button 
            onClick={handleSingleCommentAnalysis}
            disabled={isAnalyzing}
            className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-medium hover:shadow-large"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              "Analyze Comment"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <span>Bulk Upload Analysis</span>
          </CardTitle>
          <CardDescription className="text-base">
            Upload a CSV file with multiple comments for batch analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 transition-all duration-200 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <p className="mb-2 text-lg font-medium text-foreground">
                  <span>Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">CSV or TXT files only</p>
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
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-lg font-medium text-primary">Processing file...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentInput;