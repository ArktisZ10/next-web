This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**: Secure user authentication using [Better Auth](https://www.better-auth.com/) with email/password provider
- **Database**: MongoDB for storing user credentials and application data
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

### Installation

Install dependencies:

```bash
npm install
```

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

The application includes a complete authentication system:

- **Sign Up**: Create a new account at `/signup`
- **Login**: Sign in at `/login` with your username and password
- **Logout**: Click on your user avatar in the navbar to logout
- **Protected Routes**: User sessions are managed with JWT tokens

User passwords are securely hashed using bcrypt before being stored in the database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
