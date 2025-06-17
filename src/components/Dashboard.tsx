
import { useAppSharing } from '@/contexts/AppContext';
import { Navbar } from './Navbar';
import { DashboardContainer } from './DashboardContainer';
import { OptimizeSection } from './OptimizeSection';

export const Dashboard = () => {
  const { selectedReport } = useAppSharing();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {selectedReport ? <OptimizeSection /> : <DashboardContainer />}
      </main>
    </div>
  );
};
