
# Swift Resume Builder

An AI-powered Resume Builder with Clerk authentication and Strapi backend persistence.

## Project info

**URL**: https://lovable.dev/projects/05983d66-a871-4036-bf60-8b6cb4bcf7d7

## Responsive Design

All pages are now responsive:
- Navigation collapses to a hamburger menu at md breakpoint (768px)
- Resume step buttons display icons-only on small screens and wrap horizontally 
- Mobile-first approach ensures no horizontal scrolling on any screen size
- Preview panel adapts to screen size with a toggle for mobile views

## Setup Instructions

### Environment Variables

This project requires environment variables to work correctly. Create a `.env` file at the root of the project with the following variables:

```sh
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Strapi API
VITE_STRAPI_API_URL=http://localhost:1337
```

### Clerk Authentication Setup

1. Sign up for a Clerk account at [https://clerk.dev](https://clerk.dev)
2. Create a new application in the Clerk dashboard
3. Copy your Publishable Key from the Clerk dashboard
4. Add the key to your `.env` file as `VITE_CLERK_PUBLISHABLE_KEY`

### Strapi Backend Setup

#### Option 1: Run Strapi locally

1. Install Strapi globally: `npm install -g @strapi/cli`
2. Create a new Strapi project: `strapi new resume-backend --quickstart`
3. Start the Strapi server: `cd resume-backend && npm run develop`

#### Option 2: Use a hosted Strapi instance

1. Deploy Strapi to your preferred hosting provider
2. Update the `VITE_STRAPI_API_URL` in your `.env` file to point to your hosted instance

#### Configure Content Types

1. In the Strapi admin panel, create the following Content Types:
   - **User**: id (auto-generated), clerkUserId (text), name (text), email (email)
   - **Resume**: id (auto-generated), user (relation to User), templateId (text), basicInfo (json), sections (json)
2. Set appropriate permissions for these Content Types in Settings > Roles

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/05983d66-a871-4036-bf60-8b6cb4bcf7d7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Clerk (Authentication)
- Strapi (Backend)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/05983d66-a871-4036-bf60-8b6cb4bcf7d7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
