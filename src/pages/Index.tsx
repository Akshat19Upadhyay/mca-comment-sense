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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Welcome Section */}
        <Card className="bg-gradient-card shadow-large border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
          <CardHeader className="relative z-10 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              e-Consultation Sentiment Analysis Platform
            </CardTitle>
            <CardDescription className="text-lg text-foreground/80 leading-relaxed">
              AI-powered analysis tool for stakeholder comments on draft legislation. 
              Get comprehensive sentiment analysis, automated summaries, and keyword insights to enhance decision-making.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid gap-6 md:grid-cols-3 text-base">
              <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-xl">
                <div className="w-3 h-3 bg-success rounded-full shadow-glow"></div>
                <span className="font-medium">Sentiment Classification</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-xl">
                <div className="w-3 h-3 bg-primary rounded-full shadow-glow"></div>
                <span className="font-medium">Automated Summaries</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-xl">
                <div className="w-3 h-3 bg-accent rounded-full shadow-glow"></div>
                <span className="font-medium">Keyword Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        {!showResults && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Submit Comments for Analysis</h2>
              <p className="text-muted-foreground">Choose your preferred method to analyze stakeholder feedback</p>
            </div>
            <CommentInput onAnalyze={handleAnalyze} />
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-gradient-card p-6 rounded-xl shadow-medium">
              <div>
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <p className="text-muted-foreground mt-1">Comprehensive insights from {results.length} comments</p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleExport} variant="outline" size="lg" className="shadow-medium hover:shadow-large transition-all">
                  <Download className="h-5 w-5 mr-2" />
                  Export Results
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg" className="shadow-medium hover:shadow-large transition-all">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  New Analysis
                </Button>
              </div>
            </div>
            
            <SentimentDashboard results={results} />
            
            <WordCloud comments={results.map(r => r.comment)} />
          </div>
        )}

        {/* Footer */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-0 shadow-soft">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-2">
              <p className="font-semibold text-lg">Ministry of Corporate Affairs</p>
              <p className="text-muted-foreground">e-Consultation Analytics Platform</p>
              <p className="text-sm text-muted-foreground">Powered by AI-driven sentiment analysis and natural language processing</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;