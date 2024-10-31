import { BlogPost, BlogContent } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    // Import all YAML files
    const blogModule = await import('../../content/blog/blog.yml');
    const blogData = blogModule.default;
    
    // Import markdown content
    const markdownFiles = import.meta.glob('../../content/blog/posts/*.md');
    const markdownPosts = await Promise.all(
      Object.entries(markdownFiles).map(async ([path, loader]) => {
        const content = await loader();
        const slug = path.split('/').pop()?.replace(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/, '$1');
        return { ...content.default.attributes, slug };
      })
    );

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
