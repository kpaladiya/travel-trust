export type UserExperienceMode = 'creator' | 'finder';

export const userExperienceCopy: Record<
  UserExperienceMode,
  {
    label: string;
    shortLabel: string;
    description: string;
    ridesTitle: string;
    ridesSubtitle: string;
    travelTitle: string;
    travelSubtitle: string;
  }
> = {
  creator: {
    label: 'Creator mode',
    shortLabel: 'Creator',
    description: 'Post rides and create help requests for your own travel needs.',
    ridesTitle: 'Drive & Post',
    ridesSubtitle: 'Create ride listings and manage your posted rides.',
    travelTitle: 'Request Travel Help',
    travelSubtitle: 'Post help requests and track review status for your trip.',
  },
  finder: {
    label: 'Finder mode',
    shortLabel: 'Finder',
    description: 'Search rides and help travelers who request support.',
    ridesTitle: 'Find a Ride',
    ridesSubtitle: 'Search available rides and compare drivers, prices, and seats.',
    travelTitle: 'Offer Travel Help',
    travelSubtitle: 'Review traveler requests and offer help where needed.',
  },
};
