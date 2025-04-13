
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string | Date; // ISO string or Date object
  end: string | Date; // ISO string or Date object
  location?: string;
  color?: string;
  allDay?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'video' | 'document';
  }[];
}
