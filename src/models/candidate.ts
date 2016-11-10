import { User } from './user';
import { Classification } from './classification';
import { Message } from './message';

export interface Candidate {
    id: number;
    status: number;
    lng: number;
    lat: number;
    heading: number;
    pitch: number;
    createdAt: Date;
    owner: User;
    expert: User;
    classifications: Classification[];
    messages: Message[];
}
