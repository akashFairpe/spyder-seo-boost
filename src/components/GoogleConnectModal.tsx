
import { Chrome, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSharing } from '@/contexts/AppContext';
import { advanceLogin } from '@/lib/api';

interface GoogleConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleConnectModal = ({ open, onOpenChange }: GoogleConnectModalProps) => {
  const { baseUrl, setIsLoading } = useAppSharing();

  const handleAdvancedConnect = () => {
    advanceLogin(baseUrl, setIsLoading);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Chrome className="w-5 h-5 text-blue-600" />
            Connect Google Services
          </DialogTitle>
          <DialogDescription>
            Grant advanced permissions to access Google Analytics and Search Console data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900">Advanced Permissions</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This connection requires additional permissions to read your Google Analytics and Search Console data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span>Access Google Analytics data</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span>Read Search Console metrics</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span>View website performance data</span>
            </div>
          </div>

          <Button 
            onClick={handleAdvancedConnect}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Connect with Advanced Permissions
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We only use this data to provide SEO insights and optimization recommendations.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
