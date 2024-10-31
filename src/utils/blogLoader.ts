import { BlogPost, BlogContent } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogConfig = await import('../../content/blog/blog.yml');
    const blogContent = blogConfig.default as BlogContent;
    const posts = [...blogContent.posts];
    
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

export async function getBlogContent(): Promise<BlogContent> {
  const blogConfig = await import('../../content/blog/blog.yml');
  return blogConfig.default as BlogContent;
}
