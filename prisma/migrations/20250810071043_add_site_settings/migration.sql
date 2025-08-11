-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoText" TEXT NOT NULL DEFAULT 'Kitchen Cursor',
    "logoImage" TEXT,
    "useLogoImage" BOOLEAN NOT NULL DEFAULT false,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "youtubeUrl" TEXT,
    "linkedinUrl" TEXT,
    "footerAboutText" TEXT NOT NULL DEFAULT 'Discover in-depth product reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most. From kitchen gadgets to tech gear, we test everything so you don''t have to.',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@kitchencursor.com',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
