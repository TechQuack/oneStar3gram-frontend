import { User } from "./user.entity";

export interface PostComment {
    id: number;
    value: string;
    postDate: Date;
    likeCount: number;
    appUser: User;
}