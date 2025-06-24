import { Transformation } from './../../../node_modules/@imagekit/javascript/dist/interfaces/Transformation.d';
import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectToDatabase()

    const body : IVideo = await request.json()

    if(
        !body.title ||
        !body.description ||
        !body.thumbnailURL ||
        !body.videoURL
    ) {
        return NextResponse.json({ error: "missings required fields" }, { status: 400 });
    }
      
    const videosData = {
        ...body,
        controls: body?.controls ?? true,
        transformation: {
            height: 1920,
            width: 1080,
            quality: body.transformations?.quality ?? 100
        }
    }

    const newVideo = await Video.create(videosData);

    return NextResponse.json(newVideo);

  } catch (error) {
    return NextResponse.json({error: "unable to post videos because user unauthorized"})
  }
}
