import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus, FileText, MessageSquare } from "lucide-react";

interface SentimentResult {
  id: string;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  summary: string;
}

interface SentimentDashboardProps {
  results: SentimentResult[];
}

const SentimentDashboard = ({ results }: SentimentDashboardProps) => {
  const sentimentCounts = {
    positive: results.filter(r => r.sentiment === 'positive').length,
    negative: results.filter(r => r.sentiment === 'negative').length,
    neutral: results.filter(r => r.sentiment === 'neutral').length,
  };

  const totalComments = results.length;
  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive, color: 'hsl(var(--success))' },
    { name: 'Negative', value: sentimentCounts.negative, color: 'hsl(var(--destructive))' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: 'hsl(var(--neutral))' },
  ];

  const barData = [
    { sentiment: 'Positive', count: sentimentCounts.positive, fill: 'hsl(var(--success))' },
    { sentiment: 'Negative', count: sentimentCounts.negative, fill: 'hsl(var(--destructive))' },
    { sentiment: 'Neutral', count: sentimentCounts.neutral, fill: 'hsl(var(--neutral))' },
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'default' as const; // Using default as success variant
      case 'negative':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const overallSentiment = sentimentCounts.positive > sentimentCounts.negative 
    ? sentimentCounts.positive > sentimentCounts.neutral ? 'positive' : 'neutral'
    : sentimentCounts.negative > sentimentCounts.neutral ? 'negative' : 'neutral';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-base font-semibold">Total Comments</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-primary">{totalComments}</div>
            <p className="text-sm text-muted-foreground mt-1">Comments analyzed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-base font-semibold">Positive</CardTitle>
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-success">{sentimentCounts.positive}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalComments > 0 ? Math.round((sentimentCounts.positive / totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-base font-semibold">Negative</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-destructive">{sentimentCounts.negative}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalComments > 0 ? Math.round((sentimentCounts.negative / totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-300 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-base font-semibold">Overall Sentiment</CardTitle>
            <div className="p-2 bg-neutral/10 rounded-lg">
              {getSentimentIcon(overallSentiment)}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <Badge 
              variant={getSentimentBadgeVariant(overallSentiment)} 
              className="capitalize text-base px-4 py-2 font-semibold shadow-soft"
            >
              {overallSentiment}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-card shadow-large border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Sentiment Distribution</span>
            </CardTitle>
            <CardDescription className="text-base">
              Visual breakdown of comment sentiments across all submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] bg-gradient-to-br from-muted/20 to-transparent rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px -4px hsl(var(--primary) / 0.15)' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-large border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Sentiment Counts</span>
            </CardTitle>
            <CardDescription className="text-base">
              Quantitative analysis of sentiment distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] bg-gradient-to-br from-muted/20 to-transparent rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                  <XAxis 
                    dataKey="sentiment" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px -4px hsl(var(--primary) / 0.15)' 
                    }} 
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Results */}
      <Card className="bg-gradient-card shadow-large border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <span>Individual Comment Analysis</span>
          </CardTitle>
          <CardDescription className="text-base">
            Detailed sentiment analysis with AI-generated summaries for each comment
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={result.id} className="bg-gradient-card border-0 rounded-xl p-6 space-y-4 shadow-medium hover:shadow-large transition-all duration-300">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={getSentimentBadgeVariant(result.sentiment)} 
                    className="capitalize text-base px-4 py-2 font-semibold shadow-soft flex items-center space-x-2"
                  >
                    {getSentimentIcon(result.sentiment)}
                    <span>{result.sentiment}</span>
                  </Badge>
                  <div className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <div className="text-sm font-medium">Confidence:</div>
                    <div className="text-sm font-bold text-primary">
                      {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={result.confidence * 100} 
                    className="h-3 bg-muted/50" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/20 rounded-full"></div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Original Comment</span>
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-xl border-l-4 border-primary/30">
                      <p className="text-sm leading-relaxed">
                        {result.comment}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>AI Summary</span>
                    </h4>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-xl border-l-4 border-accent/30">
                      <p className="text-sm leading-relaxed font-medium">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentDashboard;