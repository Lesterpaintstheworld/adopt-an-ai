import { BlogPost, BlogContent } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    // Import all YAML files
    const blogModule = await import('../../content/blog/blog.yml');
    const blogData = blogModule.default;
    
    // Import markdown content
    const markdownFiles = import.meta.glob('../../content/blog/posts/*.md', { eager: true });
    const markdownPosts = Object.entries(markdownFiles).map(([path, content]: [string, any]) => {
      const { attributes, html } = content.default;
      return {
        ...attributes,
        content: html,
        slug: path.split('/').pop()?.replace(/\.md$/, '')
      };
    });

    // Merge YAML and markdown posts
    const allPosts = [...markdownPosts, ...blogData.posts];
    
    // Ensure we have posts
    if (!allPosts.length) {
      console.error('No blog posts found');
      return [];
    }

    const posts = [...blogData.posts];
    
    // Add featured post if it exists
    if (blogData.featured_post) {
      posts.unshift(blogData.featured_post);
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
