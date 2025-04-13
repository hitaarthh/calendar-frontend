
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  ListIcon,
  Clock3Icon,
  PlusIcon,
  SearchIcon
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarHeaderProps {
  currentDate: Date;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  currentView: 'day' | 'week' | 'month';
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onNext,
  onPrev,
  onToday,
  onViewChange,
  currentView,
  onAddEvent
}) => {
  const isMobile = useIsMobile();
  
  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };
  
  const formatDateRange = () => {
    if (currentView === 'day') {
      return new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      }).format(currentDate);
    } else if (currentView === 'week') {
      // Get the start (Sunday) and end (Saturday) of the week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      // Format the date range
      const startMonth = startOfWeek.getMonth();
      const endMonth = endOfWeek.getMonth();
      
      if (startMonth === endMonth) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(startOfWeek)}`;
      } else {
        return `${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(startOfWeek)} - ${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(endOfWeek)}`;
      }
    } else {
      return formatMonthYear(currentDate);
    }
  };
  
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
      <div className="flex items-center mb-3 md:mb-0 w-full md:w-auto">
        <Button 
          onClick={onAddEvent}
          variant="default"
          className="mr-2 flex items-center gap-1"
          size={isMobile ? "sm" : "default"}
        >
          <PlusIcon className="h-5 w-5" />
          <span className={isMobile ? "hidden" : ""}>Add Event</span>
        </Button>
        
        <div className="ml-2 flex items-center gap-1">
          <Button 
            onClick={onPrev} 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onToday}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="mx-1"
          >
            Today
          </Button>
          
          <Button 
            onClick={onNext} 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-semibold ml-3 hidden md:block">
            {formatDateRange()}
          </h2>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <h2 className="text-lg font-semibold mr-3 md:hidden">
          {formatDateRange()}
        </h2>
        
        <div className="flex-grow md:flex-grow-0"></div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-auto md:ml-0"
          title="Search"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
        
        <div className="flex rounded-md border overflow-hidden">
          <Button 
            variant={currentView === 'day' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded-none px-2.5"
            onClick={() => onViewChange('day')}
            title="Day View"
          >
            <Clock3Icon className="h-4 w-4" />
          </Button>
          <Button 
            variant={currentView === 'week' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded-none px-2.5"
            onClick={() => onViewChange('week')}
            title="Week View"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={currentView === 'month' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="rounded-none px-2.5"
            onClick={() => onViewChange('month')}
            title="Month View"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
