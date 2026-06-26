/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'menu' | 'venue' | 'reservations' | 'admin' | 'contact';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  signature?: boolean;
  icon?: string;
  tags?: string[];
}

export interface VenueSpace {
  id: string;
  name: string;
  description: string;
  subtitle: string;
  capacity: string;
  type: string;
  image: string;
  features: string[];
  status?: 'Available' | 'Reserved' | 'Under Maintenance';
}

export interface ReservationState {
  guests: string;
  date: string;
  time: string;
  experience: 'standard' | 'chef';
  name: string;
  email: string;
  specialRequests: string;
}

export interface Reservation extends ReservationState {
  id: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
  ambientLight: number;
  soundscape: string;
  interestedDishes: string[];
  assignedTable?: string;
  staffNotes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}
