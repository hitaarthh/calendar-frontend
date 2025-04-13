
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Trash2, Edit, Bell, BellOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [notifications, setNotifications] = React.useState(true);
  
  if (!event) return null;
  
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  
  const handleDelete = () => {
    onDelete(event.id);
    toast.success("Event deleted successfully");
    onClose();
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(notifications 
      ? "Notifications turned off for this event" 
      : "Notifications turned on for this event"
    );
  };
  
  const handleSnooze = () => {
    toast.success("Event snoozed for 5 minutes");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="absolute right-4 top-4 flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleNotifications} title={notifications ? "Turn off notifications" : "Turn on notifications"}>
            {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </DialogClose>
        </div>
        
        <DialogHeader>
          <div className="flex items-center">
            <div
              className="w-3 h-12 rounded-sm mr-3"
              style={{ backgroundColor: event.color || '#7C3AED' }}
            />
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <p>{format(startTime, 'EEEE, MMMM d, yyyy')}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p>
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </p>
          </div>
          
          {event.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <p>{event.location}</p>
            </div>
          )}
          
          {event.description && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                {event.description}
              </div>
            </>
          )}
          
          {event.attachments && event.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {event.attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className="border rounded-md p-2 flex items-center gap-2 text-sm"
                    >
                      {attachment.type === 'image' ? (
                        <img 
                          src={attachment.url} 
                          alt={attachment.name} 
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          {attachment.name.slice(-3)}
                        </div>
                      )}
                      <span className="truncate max-w-[150px]">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSnooze}>
              Snooze (5m)
            </Button>
            <Button size="sm" onClick={() => onEdit(event)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
