export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  userName: string;
  tags?: ('projekt' | 'ügyfél')[];
}
