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

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        console.log('Loading blog post with slug:', slug);
        
        // Load post metadata from YAML
        const blogContent = await getBlogContent();
        const foundPost = blogContent.posts.find(p => p.slug === slug) || 
          (blogContent.featured_post?.slug === slug ? blogContent.featured_post : null);
        
        console.log('Found post metadata:', foundPost);
        
        if (foundPost) {
          setPost(foundPost);
          
          // Load markdown content
          const markdownModule = await import(`../../content/blog/posts/${slug}.md`);
          console.log('Loaded markdown module:', markdownModule);
          setContent(markdownModule.default);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Post not found
        </Typography>
      </Container>
    );
  }

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
      <Box 
        dangerouslySetInnerHTML={{ __html: content }} 
        sx={{
          '& h1': { mt: 4, mb: 2 },
          '& h2': { mt: 3, mb: 2 },
          '& p': { mb: 2 },
          '& ul, & ol': { mb: 2, pl: 3 },
        }}
      />
    </Container>
  );
};

export default BlogPostPage;
