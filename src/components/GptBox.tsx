
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GptBoxProps {
  content: string;
  title: string;
}

export const GptBox = ({ content, title }: GptBoxProps) => {
  if (!content) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>AI Generated Content</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="prose max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
};

export default GptBox;
