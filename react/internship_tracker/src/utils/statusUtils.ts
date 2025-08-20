import type { InternshipStatus } from '../types/internship';

export const statusConfig = {
  applied: {
    label: 'Applied',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-500',
    icon: '📝',
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-500',
    icon: '📅',
  },
  interview_completed: {
    label: 'Interview Completed',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-500',
    icon: '✅',
  },
  offer_received: {
    label: 'Offer Received',
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-500',
    icon: '🎉',
  },
  offer_accepted: {
    label: 'Offer Accepted',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgColor: 'bg-emerald-500',
    icon: '🎊',
  },
  offer_declined: {
    label: 'Offer Declined',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-orange-500',
    icon: '❌',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-500',
    icon: '💔',
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    bgColor: 'bg-gray-500',
    icon: '🚪',
  },
};

export function getStatusConfig(status: InternshipStatus) {
  return statusConfig[status];
}

export function getStatusColor(status: InternshipStatus) {
  return statusConfig[status].color;
}

export function getStatusLabel(status: InternshipStatus) {
  return statusConfig[status].label;
}

export function getStatusIcon(status: InternshipStatus) {
  return statusConfig[status].icon;
}

export function getStatusBgColor(status: InternshipStatus) {
  return statusConfig[status].bgColor;
}

export const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'offer_accepted', label: 'Offer Accepted' },
  { value: 'offer_declined', label: 'Offer Declined' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
