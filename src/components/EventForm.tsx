
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPinIcon, ImageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

interface EventFormProps {
  date: Date;
  onSubmit: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ date, onSubmit }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date>(date);
  const [endDate, setEndDate] = React.useState<Date>(() => {
    const end = new Date(date);
    end.setHours(end.getHours() + 1);
    return end;
  });
  const [color, setColor] = React.useState("#7C3AED");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please provide an event title");
      return;
    }
    
    if (endDate < startDate) {
      toast.error("End time cannot be before start time");
      return;
    }
    
    // In a real app, this would save to a backend or state
    toast.success("Event created successfully");
    onSubmit();
  };
  
  const colorOptions = [
    { label: "Purple", value: "#7C3AED" },
    { label: "Pink", value: "#D946EF" },
    { label: "Blue", value: "#2563EB" },
    { label: "Green", value: "#10B981" },
    { label: "Orange", value: "#F97316" },
    { label: "Red", value: "#EF4444" },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Add title"
          className="mt-1"
          autoFocus
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start</Label>
          <div className="flex mt-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd, yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2">
            <Input
              type="time"
              value={format(startDate, "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const newDate = new Date(startDate);
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                setStartDate(newDate);
              }}
            />
          </div>
        </div>
        
        <div>
          <Label>End</Label>
          <div className="flex mt-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd, yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2">
            <Input
              type="time"
              value={format(endDate, "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const newDate = new Date(endDate);
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                setEndDate(newDate);
              }}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <div className="flex items-center mt-1">
          <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Add location"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description"
          className="mt-1 resize-none"
          rows={3}
        />
      </div>
      
      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-1">
          {colorOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "w-8 h-8 rounded-full cursor-pointer border-2",
                color === option.value ? "border-black dark:border-white" : "border-transparent"
              )}
              style={{ backgroundColor: option.value }}
              onClick={() => setColor(option.value)}
              title={option.label}
            />
          ))}
        </div>
      </div>
      
      <div>
        <Label>Attachments</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-muted/50 cursor-pointer mt-1">
          <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop files here, or click to select files
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onSubmit}>
          Cancel
        </Button>
        <Button type="submit">
          Save Event
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
