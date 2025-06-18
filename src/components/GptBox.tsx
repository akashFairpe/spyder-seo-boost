
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GptBoxProps {
  content: string | any;
  title: string;
}

export const GptBox = ({ content, title }: GptBoxProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (!contentRef.current) return;

    try {
      const range = document.createRange();
      range.selectNode(contentRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        // Copy as rich text (with styles)
        document.execCommand("copy");
        selection.removeAllRanges();
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>AI Generated Content</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={contentRef}
          className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50"
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 text-sm leading-relaxed">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-gray-900">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-3 text-gray-800">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-medium mb-2 text-gray-700">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-3">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-800 text-white p-3 rounded-lg overflow-x-auto mb-3">
                  {children}
                </pre>
              ),
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default GptBox;
