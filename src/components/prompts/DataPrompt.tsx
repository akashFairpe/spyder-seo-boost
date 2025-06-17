
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppSharing } from '@/contexts/AppContext';
import { getPromptData } from '@/lib/api';
import GptBox from '../GptBox';

interface DataPromptProps {
  report: any;
  id: string;
  content: any;
}

const DataPrompt = ({ report, id, content }: DataPromptProps) => {
  const { selectedDomain, baseUrl, promptData, setPromptData } = useAppSharing();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    "Top Location",
    "Low CTR Location", 
    "Top Keywords",
    "LSI Keywords",
    "High CTR Keywords",
    "Low CTR Keywords",
    "5-10 Position Keywords",
    "10-20 Position Keywords",
  ];

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    if (!report || !report.details) {
      console.error("No report data available");
      return;
    }

    let filteredData: any[] = [];
    
    switch (selectedOption) {
      case "Top Location":
        filteredData = (report.details.countries || []).slice(0, 20);
        break;
      case "Low CTR Location": {
        const lowCtrCountries = (report.details.countries || []).filter(
          (item: any) => item.ctr >= 1 && item.ctr <= 2
        );
        filteredData = lowCtrCountries
          .sort((a: any, b: any) => {
            if (b.impressions !== a.impressions) return b.impressions - a.impressions;
            return b.clicks - a.clicks;
          })
          .slice(0, 20);
        break;
      }
      case "Top Keywords":
        filteredData = (report.details.queries || [])
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 20);
        break;
      case "LSI Keywords":
        filteredData = report.details.queries || [];
        break;
      case "High CTR Keywords":
        filteredData = (report.details.queries || [])
          .sort((a: any, b: any) => {
            if (b.ctr !== a.ctr) return b.ctr - a.ctr;
            if (b.impressions !== a.impressions) return b.impressions - a.impressions;
            return b.clicks - a.clicks;
          })
          .slice(0, 20);
        break;
      case "Low CTR Keywords":
        filteredData = (report.details.queries || [])
          .sort((a: any, b: any) => {
            if (a.ctr !== b.ctr) return a.ctr - b.ctr;
            if (b.impressions !== a.impressions) return b.impressions - a.impressions;
            return b.clicks - a.clicks;
          })
          .slice(0, 20);
        break;
      case "5-10 Position Keywords": {
        const sortedByPosition = (report.details.queries || []).sort(
          (a: any, b: any) => a.position - b.position
        );
        filteredData = sortedByPosition.slice(5, 10);
        break;
      }
      case "10-20 Position Keywords": {
        const sortedByPosition = (report.details.queries || []).sort(
          (a: any, b: any) => a.position - b.position
        );
        filteredData = sortedByPosition.slice(10, 20);
        break;
      }
      default:
        break;
    }

    let CTRString = filteredData.map((item: any) => `${item.keys[0]}, ${item.clicks}, ${item.impressions}`)
      .join('\n');

    const simpleOutput = filteredData
      .map((item: any) => (item.keys && item.keys[0]) || "")
      .filter(Boolean);

    let finalData = simpleOutput.join(", ");
    let prompt = "";

    switch (selectedOption) {
      case "Top Location":
      case "Low CTR Location":
        prompt = `You are an expert SEO content strategist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. You will be given structured data and a blog article. Your task is to generate new, additional content to improve the article's performance in search rankings based on the provided SEO insights. Use the following data for optimization: - Optimization Focus: Locations - Data Insights: ${finalData}. Do not rewrite the existing article. Instead, generate new sections or content blocks that can be inserted into the article to improve SEO for the given focus. Your output must: 1. Expand on the blog's topic naturally without repeating existing content. 2. Integrate the provided SEO elements (keywords, locations, queries, etc.) seamlessly. 3. Match the tone, structure, and style of the original blog article. 4. Use relevant subheadings if needed, short paragraphs, and clear language. 5. Only output the new content that should be inserted into the blog—do not summarize or rewrite the full article. Assume the original article was about: ${content.title.rendered ? "title : " + content.title.rendered : "page content : " + content.content.rendered.slice(0, 10000)}. Now write additional blog content that enhances the article for the given SEO focus.`;
        break;
      case "Top Keywords":
      case "LSI Keywords":
        prompt = `You are an expert SEO content strategist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. You will be given structured data and a blog article. Your task is to generate new, additional content to improve the article's performance in search rankings based on the provided SEO insights. Use the following data for optimization: - Optimization Focus: Keywords - Data Insights: ${finalData}. Do not rewrite the existing article. Instead, generate new sections or content blocks that can be inserted into the article to improve SEO for the given focus. Your output must: 1. Expand on the blog's topic naturally without repeating existing content. 2. Integrate the provided SEO elements (keywords, locations, queries, etc.) seamlessly. 3. Match the tone, structure, and style of the original blog article. 4. Use relevant subheadings if needed, short paragraphs, and clear language. 5. Only output the new content that should be inserted into the blog—do not summarize or rewrite the full article. Assume the original article was about: ${content.title.rendered ? "title : " + content.title.rendered : "page content : " + content.content.rendered.slice(0, 10000)} . Now write additional blog content that enhances the article for the given SEO focus.`;
        break;
      case "High CTR Keywords":
      case "Low CTR Keywords":
        prompt = `You are an expert SEO content strategist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. You will be given structured data and a blog article. Your task is to generate new, additional content to improve the article's performance in search rankings based on the provided SEO insights. Use the following data for optimization: - Optimization Focus: CTR - Target Elements: High CTR, Low CTR - Data Insights: Keywords,clicks and impressions -${CTRString}. Do not rewrite the existing article. Instead, generate new sections or content blocks that can be inserted into the article to improve SEO for the given focus. Your output must: 1. Expand on the blog's topic naturally without repeating existing content. 2. Integrate the provided SEO elements (keywords, locations, queries, etc.) seamlessly. 3. Match the tone, structure, and style of the original blog article. 4. Use relevant subheadings if needed, short paragraphs, and clear language. 5. Only output the new content that should be inserted into the blog—do not summarize or rewrite the full article. Assume the original article was about: ${content.title.rendered ? "title : " + content.title.rendered : "page content : " + content.content.rendered.slice(0, 10000)}. Now write additional blog content that enhances the article for the given SEO focus.`;
        break;
      case "5-10 Position Keywords":
      case "10-20 Position Keywords":
        prompt = `You are an expert SEO content strategist. When enriching the content, avoid referencing source links or related sources as tooltips, and ensure all information is unique and not reused from other websites. You will be given structured data and a blog article. Your task is to generate new, additional content to improve the article's performance in search rankings based on the provided SEO insights. Use the following data for optimization: - Optimization Focus: Position - Data Insights: ${finalData}. Do not rewrite the existing article. Instead, generate new sections or content blocks that can be inserted into the article to improve SEO for the given focus. Your output must: 1. Expand on the blog's topic naturally without repeating existing content. 2. Integrate the provided SEO elements (keywords, locations, queries, etc.) seamlessly. 3. Match the tone, structure, and style of the original blog article. 4. Use relevant subheadings if needed, short paragraphs, and clear language. 5. Only output the new content that should be inserted into the blog—do not summarize or rewrite the full article. Assume the original article was about: ${content.title.rendered ? "title : " + content.title.rendered : "page content : " + content.content.rendered.slice(0, 10000)}. Now write additional blog content that enhances the article for the given SEO focus.`;
        break;
      default:
        break;
    }

    let generatedData = await getPromptData(baseUrl, selectedDomain, report?.link, id, prompt);
    setPromptData((prev) => ({
      ...prev,
      basedOnData: generatedData,
    }));
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Select a category:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {options.map((option, index) => (
            <Label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="dataOption"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                className="h-4 w-4"
              />
              <span className="text-sm">{option}</span>
            </Label>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Fetching data, please wait...
          </div>
        )}

        <GptBox content={promptData.basedOnData} title="Generated Based on Data & Updated Content" />
      </CardContent>
    </Card>
  );
};

export default DataPrompt;
