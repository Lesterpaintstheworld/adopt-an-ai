import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadBlogPosts } from '../utils/blogLoader';
import type { BlogPost, BlogContent } from '../types/blog';
import { getBlogContent } from '../utils/blogLoader';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogContent, setBlogContent] = useState<BlogContent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        console.log('Loading blog content...');
        const content = await getBlogContent();
        console.log('Loaded blog content:', content);
        setBlogContent(content);
        
        const loadedPosts = await loadBlogPosts();
        console.log('Loaded posts:', loadedPosts);
        setPosts(loadedPosts);
      } catch (error) {
        console.error('Error loading blog content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const BlogPostCard = ({ post }: { post: BlogPost }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s ease-in-out',
          }
        }}
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <CardMedia
          component="img"
          height="200"
          image={post.image}
          alt={post.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={post.category} 
              size="small" 
              color="primary" 
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              {new Date(post.date).toLocaleDateString()} • {post.author}
            </Typography>
          </Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.excerpt}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="xl">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : !blogContent ? (
        <Typography variant="h5" sx={{ textAlign: 'center', my: 4 }}>
          No blog content available
        </Typography>
      ) : (
        <>
          {/* Featured Post */}
          {blogContent.featured_post && (
            <Box sx={{ my: 8 }}>
              <Card
                sx={{
                  position: 'relative',
                  backgroundColor: 'grey.800',
                  color: '#fff',
                  mb: 4,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundImage: `url(${blogContent.featured_post.image})`,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,.3)',
                  }}
                />
                <Grid container>
                  <Grid item md={6}>
                    <Box
                      sx={{
                        position: 'relative',
                        p: { xs: 3, md: 6 },
                        pr: { md: 0 },
                      }}
                    >
                      <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                        {blogContent.featured_post.title}
                      </Typography>
                      <Typography variant="h5" color="inherit" paragraph>
                        {blogContent.featured_post.excerpt}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )}

          {/* Filters */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search posts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {blogContent.categories?.map((category) => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Blog Posts Grid */}
          <Grid container spacing={4}>
            {filteredPosts.map((post, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <BlogPostCard post={post} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BlogPage;
