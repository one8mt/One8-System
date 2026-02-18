import { useState } from 'react';
import { TopNavigation } from './src/components/TopNavigation';
import { ProcurementDashboard } from './src/components/ProcurementDashboard';
import { InventoryDashboard } from './src/components/InventoryDashboard';
import { CRMDashboard } from './src/components/CRMDashboard';
import { HomeDashboard } from './src/components/HomeDashboard';
import { SupplierPortal } from './src/components/SupplierPortal';
import { IncidentRequest } from './src/components/IncidentRequest';
import { Toaster } from './src/components/ui/sonner';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('Home');
  const [activeSubsection, setActiveSubsection] = useState('Purchase Requisitions');
  const [activeInventorySubsection, setActiveInventorySubsection] = useState('Returns');
  const [activeCRMSubsection, setActiveCRMSubsection] = useState('Objective Feedback');
  const [userRole, setUserRole] = useState<'employee' | 'manager' | 'client' | 'supplier'>('manager');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-background transition-colors duration-200`}>
      <Toaster richColors position="top-right" />
      <TopNavigation
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeSubsection={activeSubsection}
        setActiveSubsection={setActiveSubsection}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      
      <main className="pt-16">
        {userRole === 'supplier' && (
          <SupplierPortal />
        )}
        
        {userRole !== 'supplier' && activeModule === 'Home' && userRole !== 'client' && (
          <HomeDashboard userRole={userRole} />
        )}
        
        {userRole !== 'supplier' && activeModule === 'Procurement' && userRole !== 'client' && (
          <ProcurementDashboard
            activeSubsection={activeSubsection}
            setActiveSubsection={setActiveSubsection}
            userRole={userRole}
          />
        )}
        
        {userRole !== 'supplier' && activeModule === 'Inventory' && userRole !== 'client' && (
          <InventoryDashboard
            activeSubsection={activeInventorySubsection}
            setActiveSubsection={setActiveInventorySubsection}
            userRole={userRole}
          />
        )}
        
        {userRole !== 'supplier' && activeModule === 'CRM' && (
          <CRMDashboard
            activeSubsection={activeCRMSubsection}
            setActiveSubsection={setActiveCRMSubsection}
            userRole={userRole}
          />
        )}

        {userRole !== 'supplier' && userRole !== 'client' && activeModule === 'Incident Request' && (
          <IncidentRequest />
        )}
        
        {userRole !== 'supplier' && activeModule !== 'Home' && activeModule !== 'Procurement' && activeModule !== 'Inventory' && activeModule !== 'CRM' && activeModule !== 'HR' && activeModule !== 'Incident Request' && userRole !== 'client' && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="mb-2">{activeModule} Module</h2>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
