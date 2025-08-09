# BlogReview - Next.js 14 Blog + Review Platform

A complete, production-ready Next.js 14 blog and product review platform with AI-powered content generation, admin dashboard, and affiliate marketing capabilities.

## Features

### Public Site
- 🏠 **Homepage** with hero section, featured posts, and recent articles
- 📝 **Individual Blog Posts** with Tailwind typography and affiliate links
- ⭐ **Product Reviews Page** with ratings and Amazon affiliate links
- 🔍 **SEO Optimized** with metadata, OpenGraph, and JSON-LD schema

### Admin Dashboard
- 📋 **Review Queue** for AI-generated posts with full markdown preview
- ✏️ **Post Editor** with title, excerpt, hero image, and markdown content
- 🤖 **AI Post Generation** using OpenAI API for content and DALL-E for images
- 🛍️ **Product Review Management** with approval workflow
- 📊 **Dashboard** with statistics and quick actions

### AI Integration
- ✨ **OpenAI GPT-4** for SEO-optimized article generation
- 🎨 **DALL-E 3** for automatic hero image creation
- 📝 **Automated Product Reviews** with ratings and detailed content
- 🔗 **Amazon Product Integration** (mock data for development)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth with email/password and bcrypt
- **AI**: OpenAI API (GPT-4 + DALL-E 3)
- **UI Components**: Custom components with Lucide React icons

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables
Copy \`.env.example\` to \`.env\` and update the values:
\`\`\`bash
cp .env.example .env
\`\`\`

Required environment variables:
- \`DATABASE_URL\`: Database connection string
- \`NEXTAUTH_SECRET\`: Random secret for NextAuth
- \`OPENAI_API_KEY\`: Your OpenAI API key for content generation
- \`AMAZON_*\`: Amazon Product Advertising API credentials (optional for dev)

### 3. Set Up Database
\`\`\`bash
npx prisma db push
npm run db:seed
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Default Admin Credentials

After running the seed script:
- **Email**: admin@example.com
- **Password**: admin123

## API Routes

### Admin Routes
- \`GET /api/admin/review-queue\` - Get posts in review status
- \`PUT /api/admin/posts/[id]\` - Update post
- \`DELETE /api/admin/posts/[id]\` - Delete post
- \`GET /api/admin/reviews-queue\` - Get product reviews pending approval
- \`PUT /api/admin/reviews/[id]\` - Approve/edit product review
- \`DELETE /api/admin/reviews/[id]\` - Delete product review
- \`POST /api/admin/generate-post\` - Generate new post with AI

### Authentication
- \`/api/auth/[...nextauth]\` - NextAuth endpoints

## Database Schema

### Core Models
- **User**: Authentication and role management
- **Post**: Blog posts with status workflow
- **ProductReview**: Product reviews linked to posts

### Enums
- **Role**: USER | ADMIN
- **PostStatus**: DRAFT | REVIEW | PUBLISHED
- **ProductReviewStatus**: REVIEW | PUBLISHED

## Project Structure

\`\`\`
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── posts/             # Blog post pages
│   ├── reviews/           # Product reviews page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
└── lib/                  # Utilities and configurations
    ├── auth.ts           # NextAuth configuration
    ├── prisma.ts         # Prisma client
    ├── openai.ts         # OpenAI integration
    └── amazon.ts         # Amazon API integration
\`\`\`

## Deployment

### Production Environment Variables
Update your \`.env\` for production:
- Switch \`DATABASE_URL\` to PostgreSQL
- Set \`NEXTAUTH_URL\` to your domain
- Add real Amazon API credentials
- Ensure \`NEXTAUTH_SECRET\` is cryptographically secure

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Development Tips

- Use the admin dashboard at \`/admin\` to manage content
- Generate posts with AI at \`/admin/generate\`
- Review generated content at \`/admin/review-queue\`
- Check product reviews at \`/admin/reviews-queue\`
- All admin routes are protected by authentication middleware

## License

MIT License - feel free to use this project for your own blog or commercial ventures!

---

**Built with ❤️ using Next.js 14, TypeScript, and AI**