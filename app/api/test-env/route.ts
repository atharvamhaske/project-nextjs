// Test environment variables
export async function GET() {
  const envVars = {
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY ? "✅ Set" : "❌ Not set",
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_URL_ENDPOINT: process.env.NEXT_PUBLIC_URL_ENDPOINT ? "✅ Set" : "❌ Not set",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Not set",
    MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Not set",
  };

  return Response.json({
    message: "Environment Variables Status",
    environment: process.env.NODE_ENV,
    variables: envVars
  });
} 