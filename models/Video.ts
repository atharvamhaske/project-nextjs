import mongoose, {Schema, model, models} from "mongoose";
import { IUSer } from "./User";

export const VIDEO_DIM = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoURL: string,
    thumbnailURL: string,
    controls?: boolean,
    transformations?: {
        height: number,
        width: number
        quality?: number
    }

};

const videoSchema = new Schema<IVideo>({
          title: {type: String, required: true, unique: true},
          description: {type: String, required: true},
          videoURL: {type: String, required: true, unique: true},
          thumbnailURL: {type: String, required: true, unique: true},
          controls: {type: Boolean, default: true},
          transformations: {
            height: {type: Number, default: VIDEO_DIM.height},
            width: {type: Number, default: VIDEO_DIM.width},
            quality: {type: Number, min: 1, max: 100}
          }

},
{
    timestamps: true,
});

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;


//this is mongoose schema for videos 