import { User } from './user';
import { Vote } from './vote';

export interface Message {
    id: number;
    text: string;
    user: User;
    votes: Vote[];
    createdAt: Date;
}
