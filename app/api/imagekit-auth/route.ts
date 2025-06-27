// File: app/api/imagekit-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // Check if required environment variables are available
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey) {
      console.error("IMAGEKIT_PRIVATE_KEY is not configured");
      return Response.json({ 
        error: "ImageKit private key not configured" 
      }, { status: 500 });
    }

    if (!publicKey) {
      console.error("IMAGEKIT_PUBLIC_KEY is not configured");
      return Response.json({ 
        error: "ImageKit public key not configured" 
      }, { status: 500 });
    }

    console.log("Generating upload auth params...");
    
    const authParams = getUploadAuthParams({
      privateKey: privateKey,
      publicKey: publicKey,
      // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
      // token: "random-token", // Optional, a unique token for request
    });

    console.log("Auth params generated successfully");

    return Response.json({
      authParams,
      publicKey: publicKey,
    });
  } catch (error) {
    console.error("Error generating upload auth params:", error);
    return Response.json({ 
      error: "Error generating upload auth params",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
