
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSharing } from '@/contexts/AppContext';

export const DataPresentation = () => {
  const { reportData, setSelectedReport } = useAppSharing();

  const optimizeBtn = (item: any) => {
    setSelectedReport(item);
  };

  if (!reportData || reportData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page URL</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((item: any, index: number) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium max-w-xs truncate">
                <a 
                  href={item.pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.pageUrl}
                </a>
              </TableCell>
              <TableCell className="text-right">{item.clicks}</TableCell>
              <TableCell className="text-right">{item.impressions}</TableCell>
              <TableCell className="text-right">{item.ctr?.toFixed(2) || '0.00'}</TableCell>
              <TableCell className="text-right">{item.position?.toFixed(2) || '0.00'}</TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => optimizeBtn(item)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Optimize
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
