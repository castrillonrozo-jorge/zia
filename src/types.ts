
export type AppView = 
  | 'splash'
  | 'login' 
  | 'onboarding' 
  | 'home' 
  | 'wallet'
  | 'id-renewal' 
  | 'payments' 
  | 'business-reg' 
  | 'transparency' 
  | 'health' 
  | 'employment' 
  | 'credits' 
  | 'seniat' 
  | 'intt'
  | 'profile'
  | 'notifications'
  | 'my-procedures'
  | 'economy'
  | 'national-pride'
  | 'security';

export interface ServiceItem {
  id: AppView;
  title: string;
  icon: string;
  color?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  date: string;
  progress?: number;
}
