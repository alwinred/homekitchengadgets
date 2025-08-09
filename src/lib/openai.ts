import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateBlogPost(topic: string): Promise<{
  title: string
  excerpt: string
  content: string
}> {
  const topicPrompt = `
You are an expert content writer specializing in SEO-optimized blog posts. 
Write a detailed, engaging, and helpful article about "${topic}" that provides real value to the reader.

Requirements:
- Minimum 1,200 words
- Use a friendly but professional tone
- Break the content into clear sections with H2/H3 headings
- Include a short introduction and a conclusion
- Add bullet points and numbered lists where appropriate
- Optimize for search engines by naturally including relevant keywords
- Make it informative, actionable, and easy to read
- Avoid fluff and filler sentences
- DO NOT include any images, image tags, or image URLs in the content
- Focus on text content only - product images will be added separately

Format the response in HTML, using proper HTML tags for headings (<h1>, <h2>, <h3>), paragraphs (<p>), lists (<ul>, <li>), and emphasis (<strong>, <em>).
Use text descriptions instead of images for products.
Use clean, semantic HTML without CSS classes or styling attributes.

After writing the article, also provide:
1. An SEO-optimized title (max 60 characters)
2. A compelling meta description (max 160 characters)

Format your response as JSON:
{
  "title": "SEO title here",
  "excerpt": "Meta description here", 
  "content": "Full markdown article here"
}
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a skilled SEO content writer. Always respond with valid JSON."
        },
        {
          role: "user",
          content: topicPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating blog post:', error)
    throw new Error('Failed to generate blog post')
  }
}

export async function generateHeroImage(topic: string): Promise<string> {
  // Use Unsplash images instead of DALL-E to avoid expiring URLs
  // Import the function dynamically to avoid circular dependencies
  const { generateHeroImageUrl } = await import('@/lib/unsplash')
  return generateHeroImageUrl(topic)
}

export async function generateProductReview(productTitle: string, productDescription?: string): Promise<{
  rating: number
  reviewContent: string
}> {
  const topicPrompt = `
You are an expert content writer specializing in SEO-optimized product roundups and reviews. 
Write a detailed, engaging, and helpful review for the product "${productTitle}"${productDescription ? ` (${productDescription})` : ''} that provides real value to the reader.

Requirements:
- Write a 200-300 word review with pros, cons, and a verdict
- Use a friendly but professional tone
- Include specific details about features, quality, and value
- Be honest and balanced in your assessment
- Write from the perspective of someone who has used the product
- Make it helpful for potential buyers
- Provide a rating from 1-5 stars based on overall value and performance

Format your response as JSON:
{
  "rating": 4,
  "reviewContent": "The detailed review text with pros, cons, and verdict"
}
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert product reviewer who provides honest, detailed reviews. Always respond with valid JSON."
        },
        {
          role: "user",
          content: topicPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating product review:', error)
    throw new Error('Failed to generate product review')
  }
}
