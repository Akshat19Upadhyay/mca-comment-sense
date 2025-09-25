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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>Word Cloud</span>
        </CardTitle>
        <CardDescription>
          Most frequently used words across all comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 border rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
          {wordFreq.map((item, index) => (
            <div
              key={item.word}
              className="absolute font-semibold cursor-pointer hover:opacity-80 transition-opacity select-none"
              style={{
                fontSize: `${getFontSize(item.count)}px`,
                color: getRandomColor(),
                ...getRandomPosition(),
                transform: 'translate(-50%, -50%)',
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
              }}
              title={`"${item.word}" appears ${item.count} times`}
            >
              {item.word}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="flex items-center space-x-2 text-sm font-medium mb-2">
            <Hash className="h-4 w-4" />
            <span>Top Keywords</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {wordFreq.slice(0, 10).map((item) => (
              <div
                key={item.word}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border"
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
              transform: translate(-50%, -50%) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </Card>
  );
};

export default WordCloud;