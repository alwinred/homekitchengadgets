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
    "termsContent" TEXT NOT NULL DEFAULT '## Terms of Use

Welcome to Kitchen Cursor. By accessing our website, you agree to these terms and conditions.

### 1. Acceptance of Terms
By using this website, you accept and agree to be bound by the terms and provision of this agreement.

### 2. Use License
Permission is granted to temporarily download one copy of the materials on Kitchen Cursor''s website for personal, non-commercial transitory viewing only.

### 3. Disclaimer
The materials on Kitchen Cursor''s website are provided on an ''as is'' basis. Kitchen Cursor makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

### 4. Limitations
In no event shall Kitchen Cursor or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kitchen Cursor''s website.

### 5. Revisions and Errata
The materials appearing on Kitchen Cursor''s website could include technical, typographical, or photographic errors. Kitchen Cursor does not warrant that any of the materials on its website are accurate, complete or current.

### 6. Links
Kitchen Cursor has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kitchen Cursor of the site.

### 7. Site Terms of Use Modifications
Kitchen Cursor may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.

### 8. Governing Law
Any claim relating to Kitchen Cursor''s website shall be governed by the laws of the jurisdiction in which the website is operated without regard to its conflict of law provisions.',
    "privacyContent" TEXT NOT NULL DEFAULT '## Privacy Policy

Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.

### 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.

### 2. How We Use Your Information
We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send you technical notices, updates, security alerts, and support messages
- Respond to your comments, questions, and customer service requests
- Communicate with you about products, services, offers, and events

### 3. Information Sharing
We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except as described in this policy.

### 4. Cookies and Tracking Technologies
We use cookies and similar tracking technologies to track activity on our service and hold certain information.

### 5. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

### 6. Third-Party Services
Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.

### 7. Children''s Privacy
Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.

### 8. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

### 9. Contact Us
If you have any questions about this Privacy Policy, please contact us at the email address provided on our website.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("contactEmail", "createdAt", "facebookUrl", "footerAboutText", "heroDescription", "heroTitle", "id", "instagramUrl", "linkedinUrl", "logoImage", "logoText", "seoDescription", "seoKeywords", "seoTitle", "tiktokUrl", "twitterUrl", "updatedAt", "useLogoImage", "youtubeUrl") SELECT "contactEmail", "createdAt", "facebookUrl", "footerAboutText", "heroDescription", "heroTitle", "id", "instagramUrl", "linkedinUrl", "logoImage", "logoText", "seoDescription", "seoKeywords", "seoTitle", "tiktokUrl", "twitterUrl", "updatedAt", "useLogoImage", "youtubeUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
