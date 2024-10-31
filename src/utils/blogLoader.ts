import { BlogPost, BlogContent } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogContent = await getBlogContent();
    let posts: BlogPost[] = [];
    
    // Add featured post if it exists
    if (blogContent.featured_post) {
      posts.push(blogContent.featured_post);
    }
    
    // Add regular posts
    if (blogContent.posts) {
      posts = [...posts, ...blogContent.posts];
    }

    // Remove duplicates based on slug
    posts = Array.from(new Map(posts.map(post => [post.slug, post])).values());

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
    
    if (!blogData || !blogData.posts) {
      console.error('Invalid blog data structure:', blogData);
      throw new Error('Invalid blog data structure');
    }
    
    return blogData as BlogContent;
  } catch (error) {
    console.error('Error loading blog content:', error);
    throw error;
  }
}
