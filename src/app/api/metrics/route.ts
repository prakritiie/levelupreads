export async function GET() {
  return Response.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    status: "running"
  });
}