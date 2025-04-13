
import React from 'react';
import { cn } from "@/lib/utils";
import { format, getHours, getMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface DayViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ events, currentDate, onEventClick }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events for the current day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate()
    );
  });
  
  // Scroll to current time on first render
  React.useEffect(() => {
    if (containerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollPosition = currentHour * 60; // 60px per hour
      containerRef.current.scrollTop = scrollPosition - 100;
    }
  }, [currentDate]);
  
  // Event positioning helper
  const getEventPosition = (event: CalendarEvent): { top: number, height: number } => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    const startHour = getHours(start);
    const startMinute = getMinutes(start);
    const totalStartMinutes = startHour * 60 + startMinute;
    
    const endHour = getHours(end);
    const endMinute = getMinutes(end);
    const totalEndMinutes = endHour * 60 + endMinute;
    
    const top = totalStartMinutes;
    const height = Math.max(30, totalEndMinutes - totalStartMinutes);
    
    return { top, height };
  };
  
  // Check if the current date is today
  const isToday = () => {
    const today = new Date();
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getDate() === currentDate.getDate()
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 text-center border-b bg-muted/20">
        <div className="text-lg font-semibold">
          {format(currentDate, 'EEEE')}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
      </div>
      
      <div className="flex-grow overflow-auto relative" ref={containerRef}>
        <div className="grid grid-cols-[80px_1fr] relative" style={{ height: `${24 * 60}px` }}>
          {/* Time labels */}
          <div className="border-r">
            {hours.map((hour) => (
              <div 
                key={hour} 
                className="border-b h-[60px] text-xs text-muted-foreground relative pr-2"
              >
                {hour !== 0 && (
                  <span className="absolute -top-2.5 right-2">
                    {hour}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Day grid */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="border-b h-[60px] relative">
                {/* Half-hour marker */}
                <div className="absolute top-[30px] left-0 right-0 border-b border-dashed border-gray-100 dark:border-gray-800" />
              </div>
            ))}
            
            {/* Current time indicator */}
            {isToday() && (
              <div 
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                style={{ 
                  top: `${(getHours(new Date()) * 60) + getMinutes(new Date())}px` 
                }}
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -left-1 -top-1.5" />
              </div>
            )}
            
            {/* Events */}
            {dayEvents.map((event, index) => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={index}
                  className="absolute cursor-pointer z-10 animate-slide-up"
                  style={{
                    left: '4px',
                    right: '4px',
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div 
                    className="h-full p-2 rounded-md overflow-hidden text-white border-l-2"
                    style={{ 
                      backgroundColor: event.color ? `${event.color}CC` : '#7C3AEDCC',
                      borderLeftColor: event.color || '#7C3AED'
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {height > 40 && (
                      <div className="text-sm opacity-90">
                        {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                        {event.location && (
                          <div className="text-xs opacity-80 mt-1">📍 {event.location}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
