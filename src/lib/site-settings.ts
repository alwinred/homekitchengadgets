import { prisma } from '@/lib/prisma'

export async function getSiteSettings() {
  try {
    let siteSettings = await prisma.siteSettings.findFirst()
    
    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({
        data: {}
      })
    }
    
    return siteSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return default values if there's an error
               return {
             logoText: 'Kitchen Cursor',
             logoImage: null,
             useLogoImage: false,
             facebookUrl: null,
             twitterUrl: null,
             instagramUrl: null,
             tiktokUrl: null,
             youtubeUrl: null,
             linkedinUrl: null,
             footerAboutText: 'Discover in-depth product reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most. From kitchen gadgets to tech gear, we test everything so you don\'t have to.',
             contactEmail: 'contact@kitchencursor.com',
             seoTitle: 'Kitchen Cursor - Product Reviews & Tech Blog',
             seoDescription: 'Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.',
             seoKeywords: 'product reviews, tech blog, buying guides, affiliate marketing',
             heroTitle: 'Discover Amazing Products',
             heroDescription: 'In-depth reviews, expert insights, and buying guides to help you make informed decisions on the products that matter most.',
             termsContent: '## Terms of Use\n\nWelcome to Kitchen Cursor. By accessing our website, you agree to these terms and conditions.\n\n### 1. Acceptance of Terms\nBy using this website, you accept and agree to be bound by the terms and provision of this agreement.\n\n### 2. Use License\nPermission is granted to temporarily download one copy of the materials on Kitchen Cursor\'s website for personal, non-commercial transitory viewing only.\n\n### 3. Disclaimer\nThe materials on Kitchen Cursor\'s website are provided on an \'as is\' basis. Kitchen Cursor makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.\n\n### 4. Limitations\nIn no event shall Kitchen Cursor or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kitchen Cursor\'s website.\n\n### 5. Revisions and Errata\nThe materials appearing on Kitchen Cursor\'s website could include technical, typographical, or photographic errors. Kitchen Cursor does not warrant that any of the materials on its website are accurate, complete or current.\n\n### 6. Links\nKitchen Cursor has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Kitchen Cursor of the site.\n\n### 7. Site Terms of Use Modifications\nKitchen Cursor may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.\n\n### 8. Governing Law\nAny claim relating to Kitchen Cursor\'s website shall be governed by the laws of the jurisdiction in which the website is operated without regard to its conflict of law provisions.',
             privacyContent: '## Privacy Policy\n\nYour privacy is important to us. This privacy policy explains how we collect, use, and protect your information.\n\n### 1. Information We Collect\nWe collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.\n\n### 2. How We Use Your Information\nWe use the information we collect to:\n- Provide, maintain, and improve our services\n- Process transactions and send related information\n- Send you technical notices, updates, security alerts, and support messages\n- Respond to your comments, questions, and customer service requests\n- Communicate with you about products, services, offers, and events\n\n### 3. Information Sharing\nWe do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except as described in this policy.\n\n### 4. Cookies and Tracking Technologies\nWe use cookies and similar tracking technologies to track activity on our service and hold certain information.\n\n### 5. Data Security\nWe implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\n### 6. Third-Party Services\nOur website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.\n\n### 7. Children\'s Privacy\nOur service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.\n\n### 8. Changes to This Privacy Policy\nWe may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.\n\n### 9. Contact Us\nIf you have any questions about this Privacy Policy, please contact us at the email address provided on our website.'
           }
  }
}
