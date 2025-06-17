
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

interface TablePromptProps {
  report: any;
  id: string;
}

const TablePrompt = ({ report, id }: TablePromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [tableOptions, setTableOptions] = useState({
    generateTables: false,
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

    const prompt = `You are an expert in content formatting and SEO. Present the resulting table in HTML format. Also, avoid referencing source links, related sources as tooltips, or reusing content from other sites; ensure the information is unique and original. Based on the article provided, generate one or more SEO-optimized tables that summarize key points, comparisons, or structured data relevant to the blog content. Guidelines: 1. Tables should add value—use them for comparisons, summaries, data highlights, checklists, etc. 2. Make the headings clear and aligned with the blog's topic. 3. Use concise rows and columns that improve readability and visual clarity. 4. Format tables as markdown or HTML, ready for insertion into a CMS. 5. Match the tone and theme of the original article. Topic of the blog: ${report.title.rendered}, ${selectedOptions.join(", ")}, Only generate tables that would meaningfully enhance this article for both users and search engines.`;

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      tableData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate tables for this blog</CardTitle>
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

        <GptBox content={promptData.tableData} title="Generated Table & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default TablePrompt;
