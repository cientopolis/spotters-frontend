import { User } from './user';

export interface Vote {
    id: number;
    positive: boolean;
    user: User;
}