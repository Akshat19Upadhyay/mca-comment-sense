import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Hash } from "lucide-react";

interface WordCloudProps {
  comments: string[];
}

const WordCloud = ({ comments }: WordCloudProps) => {
  // Simple word frequency calculation
  const getWordFrequency = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'].includes(word));
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([word, count]) => ({ word, count }));
  };

  const allText = comments.join(' ');
  const wordFreq = getWordFrequency(allText);
  const maxCount = Math.max(...wordFreq.map(w => w.count));

  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 48;
    return minSize + (count / maxCount) * (maxSize - minSize);
  };

  const getRandomColor = () => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--success))',
      'hsl(var(--destructive))',
      'hsl(var(--neutral))',
      'hsl(var(--accent))',
      'hsl(var(--muted-foreground))',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomPosition = () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
  });

  return (
    <Card className="bg-gradient-card shadow-large border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Cloud className="h-7 w-7 text-primary" />
          </div>
          <span>Word Cloud</span>
        </CardTitle>
        <CardDescription className="text-base">
          Most frequently used words across all comments with visual density mapping
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-96 border-2 border-primary/20 rounded-xl overflow-hidden bg-gradient-to-br from-muted/20 via-primary/5 to-accent/10 shadow-medium">
          {wordFreq.map((item, index) => (
            <div
              key={item.word}
              className="absolute font-bold cursor-pointer hover:opacity-80 hover:scale-110 transition-all duration-200 select-none"
              style={{
                fontSize: `${getFontSize(item.count)}px`,
                color: getRandomColor(),
                ...getRandomPosition(),
                transform: 'translate(-50%, -50%)',
                animation: `fadeIn 0.6s ease-in-out ${index * 0.1}s both`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
              title={`"${item.word}" appears ${item.count} times`}
            >
              {item.word}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
          <h4 className="flex items-center space-x-2 text-lg font-semibold mb-3">
            <div className="p-1 bg-primary/10 rounded">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <span>Top Keywords</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {wordFreq.slice(0, 10).map((item) => (
              <div
                key={item.word}
                className="px-4 py-2 bg-primary/15 text-primary text-sm font-medium rounded-full border border-primary/30 hover:bg-primary/25 transition-colors shadow-soft"
              >
                {item.word} ({item.count})
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8) rotate(-10deg);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
          }
        `}
      </style>
    </Card>
  );
};

export default WordCloud;