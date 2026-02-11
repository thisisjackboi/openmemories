
export enum MemoryCategory {
  MEETING = 'First Meeting',
  FIGHT = 'First Fight',
  TRIP = 'First Trip',
  MILESTONE = 'Major Milestone',
  OTHER = 'Just a Sweet Moment'
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  location: {
    name: string;
    x: number; // Percent for map positioning
    y: number; // Percent for map positioning
  };
  category: MemoryCategory;
  note: string;
  imageUrl?: string;
  coupleNames: string[];
}

export interface AppState {
  memories: Memory[];
  partner1: string;
  partner2: string;
  partner1Avatar?: string;
  partner2Avatar?: string;
  startDate: string;
  isNightMode?: boolean;
}
