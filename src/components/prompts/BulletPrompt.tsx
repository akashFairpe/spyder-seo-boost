
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { extractHeadingsFromWPContent } from '@/utils/headingExtractor';
import { useAppSharing } from '@/contexts/AppContext';
import { getPromptData } from '@/lib/api';
import GptBox from '../GptBox';

interface BulletPromptProps {
  report: any;
  id: string;
}

const BulletPrompt = ({ report, id }: BulletPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [bulletOptions, setBulletOptions] = useState({
    articleContent: false,
    focusedKeyword: false,
    articleTitle: false,
    heading: false,
    keyword: "",
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setBulletOptions({
      ...bulletOptions,
      [name]: checked
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulletOptions({
      ...bulletOptions,
      keyword: e.target.value
    });
  };

  const handleBulletSubmit = async () => {
    setLoading(true);
    let selectedOptions = [];
    
    if (bulletOptions.articleContent) selectedOptions.push("article content");
    if (bulletOptions.articleTitle) selectedOptions.push(`article title:{${report.title.rendered}}`);
    if (bulletOptions.heading) {
      let headings = await extractHeadingsFromWPContent(report);
      selectedOptions.push(`headings :{${headings}},`);
    }
    if (bulletOptions.focusedKeyword && bulletOptions.keyword) {
      selectedOptions.push(`focused keyword: ${bulletOptions.keyword}`);
    }
    if (bulletOptions.articleContent) {
      selectedOptions.push(`article content: ${report.content.rendered.slice(0, 30000)}`);
    }

    const prompt = `You are an SEO content enhancer. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. Review the article and extract or generate relevant content that can be converted into clear, well-structured bullet points. Guidelines: 1. Focus on key insights, benefits, features, or steps discussed in the article. 2. Bullet points should be short, scannable, and keyword-rich. 3. Use natural language and active voice. 4. Avoid repeating full paragraphs—summarize or simplify for easier reading. 5. Ensure the bullet points could be inserted under existing subheadings or used as a quick summary section. Topic of the blog: title: ${report.title.rendered}, ${selectedOptions.join(", ")}. Output only new bullet point content that enhances the blog post.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      bulletData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate bullet points for this blog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleContent"
            checked={bulletOptions.articleContent}
            onCheckedChange={(checked) => handleCheckboxChange("articleContent", checked as boolean)}
          />
          <Label htmlFor="articleContent">Article content</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="focusedKeyword"
            checked={bulletOptions.focusedKeyword}
            onCheckedChange={(checked) => handleCheckboxChange("focusedKeyword", checked as boolean)}
          />
          <Label htmlFor="focusedKeyword">Focused keyword</Label>
        </div>

        {bulletOptions.focusedKeyword && (
          <Input
            type="text"
            placeholder="Enter keyword"
            value={bulletOptions.keyword}
            onChange={handleInputChange}
          />
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleTitle"
            checked={bulletOptions.articleTitle}
            onCheckedChange={(checked) => handleCheckboxChange("articleTitle", checked as boolean)}
          />
          <Label htmlFor="articleTitle">Article title</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="heading"
            checked={bulletOptions.heading}
            onCheckedChange={(checked) => handleCheckboxChange("heading", checked as boolean)}
          />
          <Label htmlFor="heading">Heading</Label>
        </div>

        <Button onClick={handleBulletSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.bulletData} title="Generated Bullet & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default BulletPrompt;
