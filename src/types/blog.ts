export interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
}

export interface BlogCategory {
  name: string;
  description: string;
}

export interface BlogContent {
  meta: {
    title: string;
    description: string;
  };
  featured_post: BlogPost;
  posts: BlogPost[];
  categories: BlogCategory[];
}
