import { BlogPost } from '../types/blog';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  
  try {
    // Import all .md files from the blog posts directory
    const postFiles = import.meta.glob('../../content/blog/posts/*.md');
    
    for (const path in postFiles) {
      const post = await postFiles[path]();
      const { attributes, html } = post.default;
      
      posts.push({
        ...attributes as BlogPost,
        content: html,
        slug: path.split('/').pop()?.replace('.md', '') || ''
      });
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
  
  // Sort by date
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
