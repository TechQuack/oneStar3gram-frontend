import { PostComment } from "./comment.entity";
import { MediaFile } from "./media-file.entity";

export interface Post {
    id: number;
    creator: string;
    postDate: Date;
    description: string;
    private: boolean;
    likers: string[];
    comments: PostComment[];
    media: MediaFile;
    alt: string;
}
