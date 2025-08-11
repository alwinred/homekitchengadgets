-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
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
    "seoTitle" TEXT NOT NULL DEFAULT 'Kitchen Cursor - Product Reviews & Tech Blog',
    "seoDescription" TEXT NOT NULL DEFAULT 'Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.',
    "seoKeywords" TEXT NOT NULL DEFAULT 'product reviews, tech blog, buying guides, affiliate marketing',
    "heroTitle" TEXT NOT NULL DEFAULT 'Discover Amazing Products',
    "heroDescription" TEXT NOT NULL DEFAULT 'In-depth reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("contactEmail", "createdAt", "facebookUrl", "footerAboutText", "id", "instagramUrl", "linkedinUrl", "logoImage", "logoText", "seoDescription", "seoKeywords", "seoTitle", "tiktokUrl", "twitterUrl", "updatedAt", "useLogoImage", "youtubeUrl") SELECT "contactEmail", "createdAt", "facebookUrl", "footerAboutText", "id", "instagramUrl", "linkedinUrl", "logoImage", "logoText", "seoDescription", "seoKeywords", "seoTitle", "tiktokUrl", "twitterUrl", "updatedAt", "useLogoImage", "youtubeUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
