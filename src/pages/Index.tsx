
import React from 'react';
import CalendarHeader from '@/components/CalendarHeader';
import MonthView from '@/components/MonthView';
import WeekView from '@/components/WeekView';
import DayView from '@/components/DayView';
import EventDetailModal from '@/components/EventDetailModal';
import NotificationCenter from '@/components/NotificationCenter';
import { CalendarEvent } from '@/types/calendar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import EventForm from '@/components/EventForm';
import { addDays, addHours, subDays } from 'date-fns';

const Index = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentView, setCurrentView] = React.useState<'day' | 'week' | 'month'>('month');
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = React.useState(false);
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);
  
  // Sample events
  const [events, setEvents] = React.useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team meeting to discuss project progress',
      start: addHours(new Date(), 2),
      end: addHours(new Date(), 3),
      location: 'Conference Room A',
      color: '#7C3AED',
    },
    {
      id: '2',
      title: 'Product Demo',
      description: 'Demonstrate the new features to the client',
      start: addDays(new Date(), 1),
      end: addDays(addHours(new Date(), 1), 1),
      location: 'Zoom Call',
      color: '#F97316',
    },
    {
      id: '3',
      title: 'Design Review',
      start: addDays(new Date(), 2),
      end: addDays(addHours(new Date(), 2), 2),
      color: '#2563EB',
    },
    {
      id: '4',
      title: 'Client Meeting',
      start: subDays(new Date(), 1),
      end: subDays(addHours(new Date(), 1), 1),
      location: 'Client Office',
      color: '#D946EF',
    },
    {
      id: '5',
      title: 'Lunch with Marketing',
      start: addDays(new Date(), -2),
      end: addDays(addHours(new Date(), 2), -2),
      location: 'Cafe Bistro',
      color: '#10B981',
    },
  ]);
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };
  
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventDetail(false);
    setShowEventForm(true);
  };
  
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">CalendarApp</h1>
        </div>
        <NotificationCenter events={events} />
      </div>

      <CalendarHeader
        currentDate={currentDate}
        onNext={handleNext}
        onPrev={handlePrev}
        onToday={handleToday}
        onViewChange={handleViewChange}
        currentView={currentView}
        onAddEvent={handleAddEvent}
      />

      <div className="flex-grow overflow-hidden">
        {currentView === 'month' && (
          <MonthView 
            events={events} 
            currentDate={currentDate} 
            onDateChange={setCurrentDate} 
          />
        )}
        
        {currentView === 'week' && (
          <WeekView 
            events={events} 
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
        
        {currentView === 'day' && (
          <DayView 
            events={events} 
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
      </div>
      
      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventDetail}
        onClose={() => setShowEventDetail(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
      
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent 
                ? `Edit details for ${editingEvent.title}`
                : 'Create a new event on your calendar'}
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            date={currentDate} 
            onSubmit={() => setShowEventForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
