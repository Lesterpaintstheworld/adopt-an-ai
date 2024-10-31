import { BlogPost, BlogContent } from '../types/blog';
import blogConfig from '@content/blog/blog.yml';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogContent = blogConfig as BlogContent;
    const posts = [...blogContent.posts];
    
    // Add featured post to the list if it exists
    if (blogContent.featured_post) {
      posts.unshift(blogContent.featured_post);
    }

    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogContent(): BlogContent {
  return blogConfig as BlogContent;
}
