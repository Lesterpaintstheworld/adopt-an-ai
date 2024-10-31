import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { getBlogContent } from '../utils/blogLoader';
import type { BlogPost } from '../types/blog';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        console.log('Loading blog post with slug:', slug);
        const content = await getBlogContent();
        console.log('Loaded blog content:', content);
      
        // Find the post either in regular posts or featured post
        const foundPost = content.posts.find(p => p.slug === slug) || 
          (content.featured_post?.slug === slug ? content.featured_post : null);
      
        console.log('Found post:', foundPost);
      
        if (foundPost) {
          setPost(foundPost);
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
      <Typography variant="body1">
        {post.excerpt}
      </Typography>
    </Container>
  );
};

export default BlogPostPage;
