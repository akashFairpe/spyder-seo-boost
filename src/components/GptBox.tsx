
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GptBoxProps {
  content: string | any;
  title: string;
}

export const GptBox = ({ content, title }: GptBoxProps) => {
  // Handle different content types
  const renderContent = () => {
    if (!content) return null;
    
    // If content is an object, try to extract the actual content
    if (typeof content === 'object') {
      // Try common property names for the actual content
      const actualContent = content.content || content.data || content.result || content.text || content.message;
      if (actualContent && typeof actualContent === 'string') {
        return actualContent;
      }
      // If no recognizable content property, stringify the object
      return JSON.stringify(content, null, 2);
    }
    
    // If content is already a string, return as is
    return content;
  };

  const displayContent = renderContent();
  
  if (!displayContent) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>AI Generated Content</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="prose max-w-none text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </CardContent>
    </Card>
  );
};

export default GptBox;
