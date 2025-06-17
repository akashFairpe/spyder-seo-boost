
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

interface NumberedListPromptProps {
  report: any;
  id: string;
}

const NumberedListPrompt = ({ report, id }: NumberedListPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [listOptions, setListOptions] = useState({
    generateList: false,
    provideUpdatedContent: false,
    articleContent: false,
    focusedKeyword: false,
    articleTitle: false,
    heading: false,
    keyword: "",
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setListOptions((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "focusedKeyword" && !checked ? { keyword: "" } : {}),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListOptions((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleListSubmit = async () => {
    setLoading(true);
    let selectedOptions = [];
    
    if (listOptions.articleContent) selectedOptions.push("article content");
    if (listOptions.articleTitle) selectedOptions.push(`article title:{${report.title.rendered}}`);
    if (listOptions.heading) {
      let headings = await extractHeadingsFromWPContent(report);
      selectedOptions.push(`headings :{${headings}},`);
    }
    if (listOptions.focusedKeyword && listOptions.keyword) {
      selectedOptions.push(`focused keyword: ${listOptions.keyword}`);
    }
    if (listOptions.articleContent) {
      selectedOptions.push(`article content: ${report.content.rendered.slice(0, 30000)}`);
    }

    const prompt = `You are an SEO content specialist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. Based on the article content, generate one or more informative numbered lists that provide step-by-step guides, ordered tips, or ranked information relevant to the blog's subject. Guidelines: 1. Focus on processes, steps, tips, or stages mentioned in the article. 2. Numbered lists must have a logical order. 3. Use concise, direct language in each item. 4. Lists should contain at least 5–7 points, or more if relevant. 5. Ensure the tone and format match the article for seamless insertion. Topic of the blog: title: ${report.title.rendered}, ${selectedOptions.join(", ")}. Return only the new numbered list content that should be added to the blog.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      numberListData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate Numbered List for this blog post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleContent"
            checked={listOptions.articleContent}
            onCheckedChange={(checked) => handleCheckboxChange("articleContent", checked as boolean)}
          />
          <Label htmlFor="articleContent">Article content</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="focusedKeyword"
            checked={listOptions.focusedKeyword}
            onCheckedChange={(checked) => handleCheckboxChange("focusedKeyword", checked as boolean)}
          />
          <Label htmlFor="focusedKeyword">Focused keyword</Label>
        </div>

        {listOptions.focusedKeyword && (
          <Input
            type="text"
            placeholder="Enter keyword"
            value={listOptions.keyword}
            onChange={handleInputChange}
          />
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleTitle"
            checked={listOptions.articleTitle}
            onCheckedChange={(checked) => handleCheckboxChange("articleTitle", checked as boolean)}
          />
          <Label htmlFor="articleTitle">Article title</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="heading"
            checked={listOptions.heading}
            onCheckedChange={(checked) => handleCheckboxChange("heading", checked as boolean)}
          />
          <Label htmlFor="heading">Heading</Label>
        </div>

        <Button onClick={handleListSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.numberListData} title="Generated Number list & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default NumberedListPrompt;
