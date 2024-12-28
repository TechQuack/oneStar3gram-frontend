export interface PostComment {
    id: number;
    author: string;
    value: string;
    postDate: Date;
    likers: string[];
}