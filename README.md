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
The application provides a health check endpoint at `/api/health` that returns the current status and timestamp.

### Logging
API requests are logged to the console with timestamps and request details for monitoring and debugging.

## Deployment

### Docker
Build the Docker image: `docker build -t levelupreads .`

Run the container: `docker run -p 3000:3000 levelupreads`

### CI/CD
The project includes a GitHub Actions workflow that:
- Runs linting
- Executes tests
- Builds the application
- Builds and tests the Docker image

Push to the `master` branch to trigger the CI/CD pipeline.