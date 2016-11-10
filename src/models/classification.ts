import { User } from './user';
import { Vote } from './vote';

export interface Classification {
    id: number;
    data: any;
    user: User;
    createdAt: Date;
    votes: Vote[];
}