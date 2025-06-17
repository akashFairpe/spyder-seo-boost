
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value);
  const handleModelChange = (value: string) => setAiModel(value);

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

      // Step 2: Generate images from prompt array
      const generatedImages = await Promise.all(
        promptArr.map((p: string) => getGenImg(baseUrl, p, content.title.rendered, aiModel))
      );

      const allImages = generatedImages
        .filter((res: any) => res?.images)
        .flatMap((res: any) => res.images);

      if (allImages.length === 0) {
        setError("No images generated. Try a different prompt.");
      } else {
        setImages(prev => [...allImages, ...prev]);
      }
    } catch (err) {
      console.error("Image generation flow error:", err);
      setError("An error occurred while generating images.");
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

        <Button onClick={handleImageGenerate} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Generate"}
        </Button>

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
