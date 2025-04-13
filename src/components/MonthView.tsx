
import React from 'react';
import { cn } from "@/lib/utils";
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from './EventForm';
import { CalendarEvent } from '@/types/calendar';

interface MonthViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ events, currentDate, onDateChange }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [datesWithEvents, setDatesWithEvents] = React.useState<Date[]>([]);

  // Prepare dates with events
  React.useEffect(() => {
    const dates = events.map(event => new Date(event.start));
    setDatesWithEvents(dates);
  }, [events]);
  
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
      setShowEventForm(true);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };
  
  // Custom day renderer to show events
  const renderDay = (day: Date, events: CalendarEvent[] = []) => {
    const isToday = day.toDateString() === new Date().toDateString();
    const dayEvents = getEventsForDate(day);
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div className="w-full h-full min-h-[100px] p-1 relative">
        <div 
          className={cn(
            "absolute top-1 right-1.5 flex items-center justify-center w-6 h-6 text-xs",
            isToday && "bg-calendar-today text-primary font-semibold rounded-full",
          )}
        >
          {day.getDate()}
        </div>
        
        <div className="mt-6 space-y-1 overflow-y-auto max-h-[80px]">
          {dayEvents.slice(0, 3).map((event, idx) => (
            <div 
              key={idx} 
              className="event-card text-xs p-1 truncate border-l-2"
              style={{ borderLeftColor: event.color || '#7C3AED' }}
            >
              {event.title}
            </div>
          ))}
          
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground font-medium ml-1">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-7 text-center border-b text-xs text-muted-foreground py-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-medium">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-6 h-full">
          {renderCalendarDays(currentDate, events)}
        </div>
      </div>

      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {selectedDate?.toDateString()}
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            date={selectedDate || new Date()} 
            onSubmit={() => setShowEventForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to generate calendar days for the current month view
function renderCalendarDays(currentDate: Date, events: CalendarEvent[]) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  
  const calendarDays = [];
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End with Saturday
  
  let currentDay = new Date(startDate);
  
  while (currentDay <= endDate) {
    const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
    const isToday = currentDay.toDateString() === new Date().toDateString();
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === currentDay.toDateString();
    });
    
    const hasEvents = dayEvents.length > 0;
    
    calendarDays.push(
      <div
        key={currentDay.toISOString()}
        className={cn(
          "border-r border-b p-1 relative min-h-[100px]",
          !isCurrentMonth && "bg-muted/30 text-muted-foreground",
          isToday && "bg-calendar-today",
        )}
      >
        <div className={cn(
          "absolute top-1 right-1.5 flex items-center justify-center w-6 h-6 text-xs",
          isToday && "bg-primary text-primary-foreground font-semibold rounded-full",
        )}>
          {currentDay.getDate()}
        </div>
        
        <div className="mt-6 space-y-1 overflow-y-auto max-h-[80px]">
          {dayEvents.slice(0, 3).map((event, idx) => (
            <div 
              key={idx}
              className="text-xs p-1 truncate border-l-2 glass-effect rounded-sm"
              style={{ borderLeftColor: event.color || '#7C3AED' }}
            >
              {event.title}
            </div>
          ))}
          
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground font-medium ml-1">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
    
    const nextDay = new Date(currentDay);
    nextDay.setDate(currentDay.getDate() + 1);
    currentDay = nextDay;
  }
  
  return calendarDays;
}

export default MonthView;
