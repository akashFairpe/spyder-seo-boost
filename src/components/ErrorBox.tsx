
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoxProps {
  message: string;
  onClose?: () => void;
}

export const ErrorBox = ({ message, onClose }: ErrorBoxProps) => {
  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
