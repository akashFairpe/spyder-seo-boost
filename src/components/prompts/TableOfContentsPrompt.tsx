
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

interface TableOfContentsPromptProps {
  report: any;
  id: string;
}

const TableOfContentsPrompt = ({ report, id }: TableOfContentsPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [tableOptions, setTableOptions] = useState({
    generateTables: false,
    provideUpdatedContent: false,
    articleContent: false,
    focusedKeyword: false,
    articleTitle: false,
    heading: false,
    keyword: "",
  });

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setTableOptions((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "focusedKeyword" && !checked ? { keyword: "" } : {}),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableOptions((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleTableSubmit = async () => {
    setLoading(true);
    let selectedOptions = [];
    
    if (tableOptions.articleContent) selectedOptions.push("article content");
    if (tableOptions.articleTitle) selectedOptions.push(`article title:{${report.title.rendered}}`);
    if (tableOptions.heading) {
      let headings = await extractHeadingsFromWPContent(report);
      selectedOptions.push(`headings :{${headings}},`);
    }
    if (tableOptions.focusedKeyword && tableOptions.keyword) {
      selectedOptions.push(`focused keyword: ${tableOptions.keyword}`);
    }
    if (tableOptions.articleContent) {
      selectedOptions.push(`article content: ${report.content.rendered.slice(0, 30000)}`);
    }

    const prompt = `You are a content structure expert. Present the resulting table in HTML format. Also, avoid referencing source links, related sources as tooltips, or reusing content from other sites; ensure the information is unique and original. Based on the article, generate a clean, SEO-friendly table of contents (TOC) that outlines all major headings and sections. Guidelines: 1. The TOC should reflect the actual structure of the article (including any new content). 2. Use anchor-style section headings (e.g., Introduction, Benefits of X, How to Use X, FAQs). 3. Each item should be short and descriptive. 4. The TOC should improve reader navigation and help with featured snippet eligibility. 5. Match the order and tone of the article's sections. Topic of the blog: title : ${report.title.rendered}, ${selectedOptions.join(", ")}. Return only the new Table of Contents to be added at the beginning of the blog.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      tableContentData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate Table of Contents for this blog post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleContent"
            checked={tableOptions.articleContent}
            onCheckedChange={(checked) => handleCheckboxChange("articleContent", checked as boolean)}
          />
          <Label htmlFor="articleContent">Article content</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="focusedKeyword"
            checked={tableOptions.focusedKeyword}
            onCheckedChange={(checked) => handleCheckboxChange("focusedKeyword", checked as boolean)}
          />
          <Label htmlFor="focusedKeyword">Focused keyword</Label>
        </div>

        {tableOptions.focusedKeyword && (
          <Input
            type="text"
            placeholder="Enter keyword"
            value={tableOptions.keyword}
            onChange={handleInputChange}
          />
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="articleTitle"
            checked={tableOptions.articleTitle}
            onCheckedChange={(checked) => handleCheckboxChange("articleTitle", checked as boolean)}
          />
          <Label htmlFor="articleTitle">Article title</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="heading"
            checked={tableOptions.heading}
            onCheckedChange={(checked) => handleCheckboxChange("heading", checked as boolean)}
          />
          <Label htmlFor="heading">Heading</Label>
        </div>

        <Button onClick={handleTableSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.tableContentData} title="Generated Table of content & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default TableOfContentsPrompt;
