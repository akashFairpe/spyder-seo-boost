
import { ArrowLeft, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSharing } from '@/contexts/AppContext';

export const OptimizeSection = () => {
  const { selectedReport, setSelectedReport } = useAppSharing();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedReport(null)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Optimization</h1>
          <p className="text-gray-600">AI-powered recommendations for your content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Current page performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SEO Score</span>
                  <span>75/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Readability</span>
                  <span>82/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Key Opportunities
            </CardTitle>
            <CardDescription>Areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 text-sm">Meta Description</h4>
                <p className="text-yellow-700 text-xs mt-1">Add compelling meta description</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 text-sm">Header Structure</h4>
                <p className="text-red-700 text-xs mt-1">Improve H1-H6 hierarchy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              AI Suggestions
            </CardTitle>
            <CardDescription>ChatGPT recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                • Add internal links to related articles
              </p>
              <p className="text-gray-700">
                • Include more long-tail keywords
              </p>
              <p className="text-gray-700">
                • Optimize images with alt text
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
