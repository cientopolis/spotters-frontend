import { User } from './user';
import { Vote } from './vote';

export interface Classification {
    id: number;
    status: string;
    data: any;
    user: User;
    createdAt: Date;
    votes: Vote[];
}