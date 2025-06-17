
import { Loader2 } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  );
};
