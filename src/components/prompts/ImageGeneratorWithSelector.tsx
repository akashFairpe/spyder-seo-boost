
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSharing } from '@/contexts/AppContext';

const AI_OPTIONS = ["gemini", "gpt"];

interface ImageGeneratorProps {
  report: any;
  id: string;
  content: any;
}

const ImageGeneratorWithSelector = ({ report, id, content }: ImageGeneratorProps) => {
  const { baseUrl, selectedDomain } = useAppSharing();
  const [aiModel, setAiModel] = useState("gemini");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value);
  
  const handleModelChange = (value: string) => {
    setAiModel(value);
    // Reset state when model changes to show fresh generate option
    setGeneratedPrompts([]);
    setCurrentPromptIndex(0);
  };

  const getPrompts = async (baseUrl: string, prompt: string, contentData: string, aiModel: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/get-img-prompts`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ prompt, contentData, aiModel }),
        headers: { "Content-Type": "application/json" }
      });
      return await response.json();
    } catch (err) {
      console.error("Get prompts error:", err);
      return null;
    }
  };

  const getGenImg = async (baseUrl: string, prompt: string, title: string, aiModel: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/image-generation`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ prompt, title, aiModel }),
        headers: { "Content-Type": "application/json" },
      });
      return await res.json();
    } catch (err) {
      console.log("gen image error", err);
      return null;
    }
  };

  const handleImageGenerate = async () => {
    setLoading(true);
    setError("");
    
    try {
      const contentData = content?.content?.rendered || content?.content?.rendered.slice(0, 100000) || "";
      
      // Step 1: Get prompt array
      const promptResponse = await getPrompts(baseUrl, prompt, contentData, aiModel);
      let promptArr;
      
      if (promptResponse?.aiModel) {
        promptArr = promptResponse?.prompt;
      }

      if (!Array.isArray(promptArr) || promptArr.length === 0) {
        setError("No prompts generated.");
        setLoading(false);
        return;
      }

      // Replace with new prompts and reset index
      setGeneratedPrompts(promptArr);
      setCurrentPromptIndex(0);

      // Step 2: Generate only the first image
      const firstImageResponse = await getGenImg(baseUrl, promptArr[0], content.title.rendered, aiModel);

      if (firstImageResponse?.images && firstImageResponse.images.length > 0) {
        // Replace images with new generation
        setImages(firstImageResponse.images);
      } else {
        setError("No images generated. Try a different prompt.");
      }
    } catch (err) {
      console.error("Image generation flow error:", err);
      setError("An error occurred while generating images.");
    }
    
    setLoading(false);
  };

  const handleGenerateMore = async () => {
    if (currentPromptIndex >= generatedPrompts.length - 1) {
      setError("No more prompts available.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextIndex = currentPromptIndex + 1;
      const nextPrompt = generatedPrompts[nextIndex];
      
      const imageResponse = await getGenImg(baseUrl, nextPrompt, content.title.rendered, aiModel);

      if (imageResponse?.images && imageResponse.images.length > 0) {
        // Append new images to existing ones
        setImages(prev => [...prev, ...imageResponse.images]);
        setCurrentPromptIndex(nextIndex);
      } else {
        setError("Failed to generate more images.");
      }
    } catch (err) {
      console.error("Generate more images error:", err);
      setError("An error occurred while generating more images.");
    }

    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Generate Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="aiModel">Select AI Model:</Label>
          <Select value={aiModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {AI_OPTIONS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prompt">Enter a prompt to generate images:</Label>
          <Input
            id="prompt"
            type="text"
            placeholder="E.g., A cat sitting on a rocket"
            value={prompt}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleImageGenerate} disabled={loading} className="flex-1">
            {loading ? "Generating..." : "Generate"}
          </Button>
          
          {generatedPrompts.length > 0 && currentPromptIndex < generatedPrompts.length - 1 && (
            <Button 
              onClick={handleGenerateMore} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? "Generating..." : `Generate Next (${generatedPrompts.length - currentPromptIndex - 1} left)`}
            </Button>
          )}
        </div>

        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Generating images, please wait...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        {generatedPrompts.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Generated {currentPromptIndex + 1} of {generatedPrompts.length} prompts
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {images.map((url, index) => (
              <div key={index} className="border rounded-lg p-2">
                <img 
                  src={url.includes('https') ? url : `data:image/png;base64,${url}`}
                  alt={`generated-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <a
                  href={`data:image/png;base64,${url}`}
                  download={`generated-image-${index}.png`}
                  className="block text-center mt-2 text-blue-600 text-sm hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGeneratorWithSelector;
