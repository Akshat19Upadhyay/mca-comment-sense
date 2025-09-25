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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{sentimentCounts.positive}</div>
            <p className="text-xs text-muted-foreground">
              {totalComments > 0 ? Math.round((sentimentCounts.positive / totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{sentimentCounts.negative}</div>
            <p className="text-xs text-muted-foreground">
              {totalComments > 0 ? Math.round((sentimentCounts.negative / totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
            {getSentimentIcon(overallSentiment)}
          </CardHeader>
          <CardContent>
            <Badge variant={getSentimentBadgeVariant(overallSentiment)} className="capitalize">
              {overallSentiment}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Breakdown of comment sentiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Counts</CardTitle>
            <CardDescription>Number of comments by sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sentiment" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Individual Comment Analysis</span>
          </CardTitle>
          <CardDescription>Detailed sentiment analysis for each comment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={getSentimentBadgeVariant(result.sentiment)} className="capitalize">
                    {getSentimentIcon(result.sentiment)}
                    <span className="ml-1">{result.sentiment}</span>
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                </div>
                <Progress value={result.confidence * 100} className="h-2" />
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Original Comment:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {result.comment}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">AI Summary:</h4>
                    <p className="text-sm bg-primary/5 p-2 rounded">
                      {result.summary}
                    </p>
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