# LevelUpReads

A gamified reading platform built with Next.js, TypeScript, and Tailwind CSS. Features include user dashboards, book exploration, challenges, XP system, and leaderboard.

## Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup
1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

## Testing

The project uses Jest for unit testing. Tests are located alongside the code files with `.test.ts` extension.

Run tests with: `npm test`

## Monitoring

### Health Check
The application provides health check endpoints:
- `/api/health` - Basic health status
- `/api/metrics` - System metrics (uptime, memory usage)

### Monitoring Stack
Run the full monitoring stack with Prometheus and Grafana:

```bash
docker-compose up
```

Access:
- Application: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Deployment

### Local Docker
```bash
docker build -t levelupreads .
docker run -p 3000:3000 levelupreads
```

### Docker Compose (with monitoring)
```bash
docker-compose up
```

### Automated Deployment
The CI/CD pipeline automatically deploys to Render after successful tests.

To set up Render deployment:
1. Create a Render service connected to this GitHub repo
2. Get the deploy hook URL from Render dashboard
3. Add `RENDER_DEPLOY_HOOK_URL` as a GitHub secret
4. Push to trigger automatic deployment