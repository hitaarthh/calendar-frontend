
import React from 'react';
import { cn } from "@/lib/utils";
import { addDays, format, getHours, getMinutes, isSameDay, setHours, setMinutes } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeekViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ events, currentDate, onEventClick }) => {
  const isMobile = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Get start and end of the week
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
  
  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events for the current week
  const weekEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventDay = eventStart.getDay();
    const startDay = startOfWeek.getDay();
    
    return (
      eventStart >= startOfWeek && 
      eventStart < addDays(startOfWeek, 7)
    );
  });
  
  // Scroll to current time on first render
  React.useEffect(() => {
    if (containerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollPosition = currentHour * 60; // 60px per hour
      containerRef.current.scrollTop = scrollPosition;
    }
  }, []);
  
  // Event positioning helper
  const getEventPosition = (event: CalendarEvent): { day: number, top: number, height: number } => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    const day = start.getDay();
    const startHour = getHours(start);
    const startMinute = getMinutes(start);
    const totalStartMinutes = startHour * 60 + startMinute;
    
    const endHour = getHours(end);
    const endMinute = getMinutes(end);
    const totalEndMinutes = endHour * 60 + endMinute;
    
    const top = totalStartMinutes;
    const height = Math.max(30, totalEndMinutes - totalStartMinutes);
    
    return { day, top, height };
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-8 border-b">
        <div className="border-r p-2 text-center text-xs text-muted-foreground">
          GMT{new Date().getTimezoneOffset() / -60}
        </div>
        {weekDays.map((day, index) => {
          const isCurrentDay = isToday(day);
          return (
            <div 
              key={index} 
              className={cn(
                "p-2 text-center border-r",
                isCurrentDay && "bg-calendar-today"
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "text-sm font-semibold mt-1",
                isCurrentDay && "text-primary"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex-grow overflow-auto relative" ref={containerRef}>
        <div className="grid grid-cols-8 relative" style={{ height: `${24 * 60}px` }}>
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
          
          {/* Days grid */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r relative">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="border-b h-[60px] relative"
                >
                  {/* Half-hour marker */}
                  <div className="absolute top-[30px] left-0 right-0 border-b border-dashed border-gray-100 dark:border-gray-800" />
                </div>
              ))}
              
              {/* Current time indicator */}
              {isToday(day) && (
                <div 
                  className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                  style={{ 
                    top: `${(getHours(new Date()) * 60) + getMinutes(new Date())}px` 
                  }}
                >
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -left-1 -top-1.5" />
                </div>
              )}
            </div>
          ))}
          
          {/* Events */}
          {weekEvents.map((event, index) => {
            const { day, top, height } = getEventPosition(event);
            return (
              <div
                key={index}
                className="absolute cursor-pointer z-10 animate-fade-in"
                style={{
                  left: `calc(${(day + 1) * (100 / 8)}% + 4px)`,
                  width: `calc(${100 / 8}% - 8px)`,
                  top: `${top}px`,
                  height: `${height}px`,
                }}
                onClick={() => onEventClick(event)}
              >
                <div 
                  className="h-full p-1 rounded-sm overflow-hidden text-xs text-white border-l-2"
                  style={{ 
                    backgroundColor: event.color ? `${event.color}CC` : '#7C3AEDCC',
                    borderLeftColor: event.color || '#7C3AED'
                  }}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  {height > 40 && (
                    <div className="truncate opacity-80">
                      {format(new Date(event.start), 'h:mm a')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
