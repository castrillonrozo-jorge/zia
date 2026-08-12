
export type AppView = 
  | 'splash'
  | 'login'
  | 'home'
  | 'wallet'
  | 'id-renewal' 
  | 'payments' 
  | 'business-reg'
  | 'renacer'
  | 'transparency'
  | 'health' 
  | 'employment'
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
