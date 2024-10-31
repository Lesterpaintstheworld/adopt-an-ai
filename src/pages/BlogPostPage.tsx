import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { getBlogContent } from '../utils/blogLoader';
import type { BlogPost } from '../types/blog';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      console.log('Starting to load blog post...');
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading blog post with slug:', slug);
        
        // Try to directly import the markdown file first
        try {
          console.log('Attempting to load markdown file directly...');
          // Try both with and without date prefix
          const posts = import.meta.glob('../../content/blog/posts/*.md');
          const matchingPost = Object.keys(posts).find(path => {
            const filename = path.split('/').pop() || '';
            return filename === `${slug}.md` || filename.endsWith(`-${slug}.md`) || filename === slug;
          });
          
          if (!matchingPost) {
            throw new Error('Markdown file not found');
          }

          const markdownModule = await posts[matchingPost]();
          console.log('Markdown module loaded:', markdownModule);
          
          // The markdown plugin should provide both html and frontmatter
          const { default: { attributes, html } } = markdownModule;
          console.log('Markdown content:', { html, attributes });
          
          if (attributes.content || html) {
            setContent(attributes.content || html);
            // Use frontmatter as post metadata if available
            if (attributes) {
              setPost({
                title: attributes.title,
                slug: attributes.slug,
                author: attributes.author,
                date: attributes.date,
                excerpt: attributes.excerpt || '',
                image: attributes.image || '/images/blog/default.jpg',
                category: attributes.category || 'Uncategorized'
              });
            }
          } else {
            throw new Error('No HTML content found in markdown file');
          }
        } catch (markdownError) {
          console.error('Error loading markdown:', markdownError);
          
          // Fallback to YAML metadata
          console.log('Falling back to YAML metadata...');
          const blogContent = await getBlogContent();
          console.log('Blog content loaded:', blogContent);
          
          const foundPost = blogContent.posts.find(p => p.slug === slug) || 
            (blogContent.featured_post?.slug === slug ? blogContent.featured_post : null);
          
          console.log('Found post in YAML:', foundPost);
          
          if (!foundPost) {
            throw new Error('Post not found in YAML data');
          }
          
          setPost(foundPost);
        }
      } catch (error) {
        console.error('Error in loadPost:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Error Loading Post
        </Typography>
        <Typography color="error">
          {error.message}
        </Typography>
      </Container>
    );
  }

  // Show not found state
  if (!post) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Post not found
        </Typography>
      </Container>
    );
  }

  // Show post content
  try {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            By {post.author} • {new Date(post.date).toLocaleDateString()}
          </Typography>
        </Box>
        {post.image && (
          <Box 
            component="img"
            src={post.image}
            alt={post.title}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3
            }}
          />
        )}
        {content ? (
          <Box 
            dangerouslySetInnerHTML={{ __html: content }} 
            sx={{
              '& h1': { mt: 4, mb: 2 },
              '& h2': { mt: 3, mb: 2 },
              '& p': { mb: 2 },
              '& ul, & ol': { mb: 2, pl: 3 },
            }}
          />
        ) : (
          <Typography color="text.secondary">
            No content available
          </Typography>
        )}
      </Container>
    );
  } catch (renderError) {
    console.error('Error rendering blog post:', renderError);
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Error Rendering Post
        </Typography>
        <Typography color="error">
          {renderError instanceof Error ? renderError.message : 'Unknown error'}
        </Typography>
      </Container>
    );
  }
};

export default BlogPostPage;
