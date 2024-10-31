import { BlogPost, BlogContent } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    // Import YAML data
    const blogModule = await import('../../content/blog/blog.yml');
    const blogData = blogModule.default;
    
    // Start with an array of posts from the YAML
    let posts: BlogPost[] = [];
    
    // Add featured post if it exists
    if (blogData.featured_post) {
      posts.push(blogData.featured_post);
    }
    
    // Add regular posts
    if (blogData.posts) {
      posts = [...posts, ...blogData.posts];
    }

    // Import and merge markdown content
    const markdownFiles = import.meta.glob('../../content/blog/posts/*.md', { eager: true });
    
    // Update markdown content for matching posts
    for (const [path, content] of Object.entries(markdownFiles)) {
      const { attributes, html } = (content as any).default;
      const slug = path.split('/').pop()?.replace(/\.md$/, '');
      
      // Find matching post and update its content
      const postIndex = posts.findIndex(p => p.slug === slug || p.slug === attributes.slug);
      if (postIndex !== -1) {
        posts[postIndex] = {
          ...posts[postIndex],
          ...attributes,
          content: html
        };
      }
    }

    // Sort by date
    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getBlogContent(): Promise<BlogContent> {
  try {
    const blogModule = await import('../../content/blog/blog.yml');
    const blogData = blogModule.default;
    
    if (!blogData) {
      throw new Error('Blog data is missing');
    }
    
    return blogData as BlogContent;
  } catch (error) {
    console.error('Error loading blog content:', error);
    throw error;
  }
}
