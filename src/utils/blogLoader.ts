import { BlogPost } from '../types/blog';
import matter from 'gray-matter';

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  
  try {
    const postFiles = import.meta.glob('../../content/blog/posts/*.md', { 
      query: '?raw',
      import: 'default'
    });
    
    for (const path in postFiles) {
      const content = await postFiles[path]();
      const { data } = matter(content);
      
      posts.push({
        title: data.title,
        excerpt: data.excerpt,
        image: data.image,
        date: data.date,
        author: data.author,
        category: data.category,
        slug: data.slug
      });
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
  
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
