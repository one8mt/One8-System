import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Sun, 
  Moon, 
  MessageCircle, 
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

interface TopNavigationProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeSubsection: string;
  setActiveSubsection: (subsection: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  userRole: 'employee' | 'manager' | 'client' | 'supplier';
  setUserRole: (role: 'employee' | 'manager' | 'client' | 'supplier') => void;
}

const erpModules = ['Home', 'Procurement', 'Finance', 'CRM', 'Inventory'];
const procurementSubsections = ['Purchase Requisitions', 'Requests for Quotation', 'Purchase Orders'];

export function TopNavigation({
  activeModule,
  setActiveModule,
  activeSubsection,
  setActiveSubsection,
  darkMode,
  toggleDarkMode,
  userRole,
  setUserRole
}: TopNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRoleSwitch = (newRole: 'employee' | 'manager' | 'client' | 'supplier') => {
    console.log('Role switch triggered, current role:', userRole);
    console.log('Switching to:', newRole);
    setUserRole(newRole);
    setIsDropdownOpen(false);
    
    // If switching to client, automatically switch to CRM module
    if (newRole === 'client') {
      setActiveModule('CRM');
      toast.success('Switched to Client Portal', {
        description: 'تم التبديل إلى بوابة العميل',
      });
    } else if (newRole === 'supplier') {
      toast.success('Switched to Supplier Portal', {
        description: 'تم التبديل إلى بوابة المورد',
      });
    } else if (newRole === 'manager') {
      toast.success('Switched to Manager view', {
        description: 'تم التبديل إلى عرض المدير',
      });
    } else {
      toast.success('Switched to Employee view', {
        description: 'تم التبديل إلى عرض الموظف',
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <img src="/one8logo.png" alt="ONE8" className="h-8 w-auto" />
          </div>
          
          {/* ERP Modules */}
          <nav className="flex items-center space-x-1">
            {erpModules.map((module) => (
              <Button
                key={module}
                variant={activeModule === module ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveModule(module)}
                className={
                  activeModule === module
                    ? "bg-[#0B3AAE] text-white hover:bg-[#0B3AAE]/90 px-4"
                    : "px-4"
                }
              >
                {module}
              </Button>
            ))}
          </nav>
        </div>

        {/* Right Section - User Profile and Controls */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-3 px-2 hover:bg-muted"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Ahmed B</p>
                  {/* <Badge variant={userRole === 'manager' ? 'default' : 'secondary'} className="text-xs">
                    {userRole === 'manager' ? 'Manager' : 'Employee'}
                  </Badge> */}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userRole === 'client'
                    ? 'Client Portal'
                    : userRole === 'supplier'
                      ? 'Supplier Portal'
                      : userRole === 'manager' 
                        ? `${activeModule === 'Home' ? 'ERP' : activeModule} Manager` 
                        : `${activeModule === 'Home' ? 'ERP' : activeModule} Officer`}
                </p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-lg overflow-hidden z-50">
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Account
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile Settings
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Preferences
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleRoleSwitch('employee')}
                >
                  Switch to Employee View
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleRoleSwitch('manager')}
                >
                  Switch to Manager View
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleRoleSwitch('client')}
                >
                  Switch to Client Portal
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleRoleSwitch('supplier')}
                >
                  Switch to Supplier Portal
                </button>
                <button
                  className="w-full text-left py-3 px-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
