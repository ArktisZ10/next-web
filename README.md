This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**: Secure user authentication using [Better Auth](https://www.better-auth.com/) with Discord OAuth2
- **Database**: MongoDB for storing user data and application data
- **UI**: Built with [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)

## Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB instance running locally or remotely

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `AUTH_SECRET`: Generate a secret key using `openssl rand -base64 32`
   - `DISCORD_CLIENT_ID`: Your Discord application client ID
   - `DISCORD_CLIENT_SECRET`: Your Discord application client secret
   - `NEXT_PUBLIC_APP_URL`: Your application URL (e.g., `http://localhost:3000` for development)

### Setting up Discord OAuth2

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Navigate to the OAuth2 section
4. Add a redirect URL: `http://localhost:3000/api/auth/discord/callback` (for development)
5. Copy your Client ID and Client Secret to `.env.local`

### Installation

Install dependencies:

```bash
pnpm install
```

### Running the Development Server

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

The application includes Discord OAuth2 authentication:

- **Login**: Click "Login with Discord" in the navbar to authenticate
- **Logout**: Click on your user avatar in the navbar to logout
- **Protected Routes**: User sessions are managed with JWT tokens and the nextCookies plugin
- **User Avatar**: Profile pictures are automatically fetched from Discord

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
