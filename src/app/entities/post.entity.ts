import { PostComment } from "./comment.entity";
import { MediaFile } from "./media-file.entity";
import { User } from "./user.entity";

export interface Post {
    id: number;
    creator:User;
    postDate: Date;
    description: string;
    likes: number;
    comments: PostComment[];
    media: MediaFile;
    alt: string;
    private: boolean;
}