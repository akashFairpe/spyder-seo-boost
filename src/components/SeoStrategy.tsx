import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, ExternalLink, Copy, Check } from "lucide-react";
import { useAppSharing } from "@/contexts/AppContext";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountrySelector } from "./CountrySelector";

interface SearchResult {
  title: string;
  link: string;
  source: string;
  displayUrl: string;
  description: string;
  position: number;
}

interface SeoStrategyData {
  results: SearchResult[];
  relatedKeywords: string[];
  aiStrategy: string;
}

interface SeoStrategyProps {
  baseUrl: string;
}

interface Country {
  country_name: string;
  country_code: string;
}

export const SeoStrategy = ({ baseUrl }: SeoStrategyProps) => {
  const { setIsLoading, setErrorMsg } = useAppSharing();
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [strategyData, setStrategyData] = useState<SeoStrategyData | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  // Keep track of the country that was used for the current data
  const [currentDataCountry, setCurrentDataCountry] = useState<Country | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim() || !selectedCountry) {
      setErrorMsg("Please enter both keyword and select a country");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/searched-seo`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location: selectedCountry.country_name,
          country_code: selectedCountry.country_code,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data && result.aiStrategy) {
        setStrategyData({
          ...result.data,
          aiStrategy: result.aiStrategy,
        });
        // Update the current data country only when new data arrives
        setCurrentDataCountry(selectedCountry);
      }
    } catch (error) {
      console.error("SEO Strategy fetch error:", error);
      setErrorMsg("Failed to fetch SEO strategy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyStrategy = () => {
    if (!strategyData?.aiStrategy) return;

    try {
      navigator.clipboard.writeText(strategyData.aiStrategy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            SEO Strategy Research
          </CardTitle>
          <CardDescription>
            Enter a keyword and select a country to get comprehensive SEO insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                type="text"
                placeholder="e.g., adspyder"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <CountrySelector
                value={selectedCountry}
                onSelect={setSelectedCountry}
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Generate SEO Strategy
          </Button>
        </CardContent>
      </Card>

      {/* Results Layout - Full Height Container */}
      {strategyData && (
        <div className="h-[calc(100vh-300px)] flex gap-6">
          {/* Sidebar - Results and Keywords */}
          <div className="w-1/3 space-y-4">
            {/* Search Results */}
            <Card className="h-1/2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Search Results</CardTitle>
                <CardDescription>
                  Top ranking pages for "{keyword}" in {currentDataCountry?.country_name || "Selected Country"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {strategyData.results.map((result, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-blue-600 hover:text-blue-800 leading-tight mb-1">
                              <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-1 break-words"
                                title={result.title}
                              >
                                <span className="truncate">{result.title}</span>
                                <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              </a>
                            </h4>
                            <p className="text-xs text-green-600 mb-1 truncate" title={result.displayUrl}>
                              {result.displayUrl}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {result.source}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            #{result.position}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Related Keywords */}
            <Card className="h-1/2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Keywords</CardTitle>
                <CardDescription>
                  Keywords related to your search term
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <ScrollArea className="h-full">
                  <div className="flex flex-wrap gap-2 pr-4">
                    {strategyData.relatedKeywords.map((relatedKeyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {relatedKeyword}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - AI Strategy */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">AI SEO Strategy</CardTitle>
                    <CardDescription>
                      Comprehensive SEO recommendations based on competitor
                      analysis
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyStrategy}
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
              <CardContent className="h-full pb-6">
                <ScrollArea className="h-full">
                  <div className="border rounded-lg p-4 bg-gray-50 pr-4">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-3 text-sm leading-relaxed">
                            {children}
                          </p>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-4 text-gray-900">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mb-3 text-gray-800">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-medium mb-2 text-gray-700">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-sm font-medium mb-2 text-gray-700">
                            {children}
                          </h4>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-3 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-3 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm text-gray-700">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-700">{children}</em>
                        ),
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
                      {strategyData.aiStrategy}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
