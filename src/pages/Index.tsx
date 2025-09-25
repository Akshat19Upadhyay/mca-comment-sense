import { useState } from "react";
import Header from "@/components/Header";
import CommentInput from "@/components/CommentInput";
import SentimentDashboard from "@/components/SentimentDashboard";
import WordCloud from "@/components/WordCloud";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SentimentResult {
  id: string;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  summary: string;
}

const Index = () => {
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock sentiment analysis function
  const analyzeSentiment = (comment: string): SentimentResult => {
    // Simple mock analysis based on keywords
    const positiveWords = ['good', 'excellent', 'great', 'positive', 'beneficial', 'approve', 'support', 'agree', 'helpful', 'effective'];
    const negativeWords = ['bad', 'terrible', 'poor', 'negative', 'harmful', 'oppose', 'disagree', 'reject', 'ineffective', 'problematic'];
    
    const lowerComment = comment.toLowerCase();
    const positiveScore = positiveWords.reduce((score, word) => 
      score + (lowerComment.includes(word) ? 1 : 0), 0);
    const negativeScore = negativeWords.reduce((score, word) => 
      score + (lowerComment.includes(word) ? 1 : 0), 0);
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      confidence = Math.min(0.7 + (positiveScore * 0.1), 0.95);
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      confidence = Math.min(0.7 + (negativeScore * 0.1), 0.95);
    } else {
      sentiment = 'neutral';
      confidence = 0.6 + Math.random() * 0.2;
    }

    // Generate a simple summary
    const words = comment.split(' ');
    const summary = words.length > 20 
      ? `${words.slice(0, 15).join(' ')}... (${sentiment} sentiment detected)`
      : `${comment} (${sentiment} sentiment detected)`;

    return {
      id: Math.random().toString(36).substr(2, 9),
      comment,
      sentiment,
      confidence,
      summary
    };
  };

  const handleAnalyze = (comments: string[]) => {
    const analysisResults = comments.map(comment => analyzeSentiment(comment));
    setResults(analysisResults);
    setShowResults(true);
  };

  const handleReset = () => {
    setResults([]);
    setShowResults(false);
    toast.success("Analysis cleared");
  };

  const handleExport = () => {
    const csvContent = [
      ['Comment', 'Sentiment', 'Confidence', 'Summary'],
      ...results.map(r => [r.comment, r.sentiment, r.confidence.toString(), r.summary])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Results exported successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">e-Consultation Sentiment Analysis Platform</CardTitle>
            <CardDescription className="text-lg">
              AI-powered analysis tool for stakeholder comments on draft legislation. 
              Get comprehensive sentiment analysis, automated summaries, and keyword insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Sentiment Classification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Automated Summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Keyword Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        {!showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submit Comments for Analysis</h2>
            <CommentInput onAnalyze={handleAnalyze} />
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <div className="flex space-x-2">
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <SentimentDashboard results={results} />
            
            <WordCloud comments={results.map(r => r.comment)} />
          </div>
        )}

        {/* Footer */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Ministry of Corporate Affairs - e-Consultation Analytics Platform</p>
              <p>Powered by AI-driven sentiment analysis and natural language processing</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;