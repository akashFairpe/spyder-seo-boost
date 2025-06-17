
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSharing } from '@/contexts/AppContext';
import { getPromptData } from '@/lib/api';
import GptBox from '../GptBox';

interface SingleFocusedKeywordPromptProps {
  report: any;
  id: string;
}

const SingleFocusedKeywordPrompt = ({ report, id }: SingleFocusedKeywordPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleKeywordSubmit = async () => {
    setLoading(true);
    
    const prompt = `Optimize the existing content by focusing on this keyword: {${keyword}}. Then provide me the entire updated content.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      SingleData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Enter a keyword to optimize content for:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            type="text"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={handleInputChange}
          />
        </div>

        <Button onClick={handleKeywordSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.SingleData} title="Generated Based on Single Keyword & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default SingleFocusedKeywordPrompt;
