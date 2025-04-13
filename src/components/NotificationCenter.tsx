
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, BellOffIcon, CheckCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface NotificationProps {
  id: string;
  type: 'event_reminder' | 'event_update' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  event?: CalendarEvent;
  read: boolean;
}

interface NotificationCenterProps {
  events: CalendarEvent[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ events }) => {
  const [open, setOpen] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(3);
  const [notifications, setNotifications] = React.useState<NotificationProps[]>([
    {
      id: '1',
      type: 'event_reminder',
      title: 'Upcoming Event',
      message: "Don't forget your meeting in 15 minutes!",
      timestamp: new Date(),
      event: events[0],
      read: false
    },
    {
      id: '2',
      type: 'system',
      title: 'Welcome!',
      message: 'Welcome to your new calendar app.',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      type: 'event_update',
      title: 'Event Updated',
      message: 'Team meeting location has changed.',
      timestamp: new Date(Date.now() - 86400000),
      event: events[1],
      read: false
    }
  ]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[440px] p-0">
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <SheetTitle>Notifications</SheetTitle>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BellOffIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="mt-4">
            {notifications.filter(n => !n.read).length > 0 ? (
              <div className="space-y-4">
                {notifications
                  .filter(notification => !notification.read)
                  .map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>You're all caught up!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events
                  .filter(event => new Date(event.start) > new Date())
                  .slice(0, 3)
                  .map(event => (
                    <div 
                      key={event.id}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.start), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No upcoming events</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

interface NotificationItemProps {
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  return (
    <div 
      className={cn(
        "flex gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        notification.read ? "opacity-70" : "hover:bg-muted/50"
      )}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
        {notification.type === 'event_reminder' && <Clock className="h-5 w-5" />}
        {notification.type === 'event_update' && <Clock className="h-5 w-5" />}
        {notification.type === 'system' && <BellIcon className="h-5 w-5" />}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <p className={cn("font-medium", !notification.read && "text-primary")}>
            {notification.title}
            {!notification.read && (
              <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
            )}
          </p>
          <span className="text-xs text-muted-foreground">
            {format(notification.timestamp, 'h:mm a')}
          </span>
        </div>
        
        <p className="text-sm mt-1 text-muted-foreground">
          {notification.message}
        </p>
        
        {notification.event && (
          <div className="mt-1 text-xs flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: notification.event.color || '#7C3AED' }}
            />
            <span>{format(new Date(notification.event.start), 'MMM d, h:mm a')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
