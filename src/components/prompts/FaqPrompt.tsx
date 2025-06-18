
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

interface FaqPromptProps {
  report: any;
  id: string;
}

const FaqPrompt = ({ report, id }: FaqPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [faqOptions, setFaqOptions] = useState({
    generateFaq: false,
    provideUpdatedContent: false,
    articleContent: false,
    focusedKeyword: false,
    articleTitle: false,
    heading: false,
    keyword: "",
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFaqOptions((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "focusedKeyword" && !checked ? { keyword: "" } : {}),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaqOptions((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleFaqSubmit = async () => {
    setLoading(true);
    let selectedOptions = [];
    
    if (faqOptions.articleContent) selectedOptions.push("article content");
    if (faqOptions.articleTitle) selectedOptions.push(`article title:{${report.title.rendered}}`);
    if (faqOptions.heading) {
      let headings = await extractHeadingsFromWPContent(report);
      selectedOptions.push(`headings :{${headings}},`);
    }
    if (faqOptions.focusedKeyword && faqOptions.keyword) {
      selectedOptions.push(`focused keyword: ${faqOptions.keyword}`);
    }
    if (faqOptions.articleContent) {
      selectedOptions.push(`article content: ${report.content.rendered.slice(0, 30000)}`);
    }

    const prompt = `You are an SEO content strategist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. Based on the content of the following blog post, generate a set of frequently asked questions (FAQs) along with their answers. Your goal is to enhance the SEO value of the post by addressing real user queries related to the topic. Guidelines: 1. Extract relevant, natural-sounding questions that readers may search on Google. 2. Provide concise and informative answers in a tone that matches the original article. 3. Include at least 4–6 FAQs covering a mix of beginner and advanced-level concerns. 4. Use keywords from the article context where appropriate without stuffing. 5. Ensure each FAQ can be directly inserted into the blog post as a standalone section. Assume this is the blog's title: ${report.title.rendered}, ${selectedOptions.join(", ")} . Generate only the new FAQ content that can be added to the existing article.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    
    // Add debug logging
    console.log("Generated FAQ data:", generatedData);
    console.log("Type of generated data:", typeof generatedData);
    
    setPromptData((prev) => ({
      ...prev,
      faqData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate FAQ's for this blog post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleContent"
            checked={faqOptions.articleContent}
            onCheckedChange={(checked) => handleCheckboxChange("articleContent", checked as boolean)}
          />
          <Label htmlFor="articleContent">Article content</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="focusedKeyword"
            checked={faqOptions.focusedKeyword}
            onCheckedChange={(checked) => handleCheckboxChange("focusedKeyword", checked as boolean)}
          />
          <Label htmlFor="focusedKeyword">Focused keyword</Label>
        </div>

        {faqOptions.focusedKeyword && (
          <Input
            type="text"
            placeholder="Enter keyword"
            value={faqOptions.keyword}
            onChange={handleInputChange}
          />
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleTitle"
            checked={faqOptions.articleTitle}
            onCheckedChange={(checked) => handleCheckboxChange("articleTitle", checked as boolean)}
          />
          <Label htmlFor="articleTitle">Article title</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="heading"
            checked={faqOptions.heading}
            onCheckedChange={(checked) => handleCheckboxChange("heading", checked as boolean)}
          />
          <Label htmlFor="heading">Heading</Label>
        </div>

        <Button onClick={handleFaqSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.faqData} title="Generated FAQ & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default FaqPrompt;
