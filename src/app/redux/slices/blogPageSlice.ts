// redux/slices/blogPageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Interfaces
export interface HeroContent {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export interface Article {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

export interface FeaturedPost {
  title: string;
  post: Article;
}

export interface NewsletterContent {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
}

export interface BlogContent {
  hero: HeroContent;
  featured: FeaturedPost;
  categories: string[];
  articles: Article[];
  newsletter: NewsletterContent;
}

interface BlogState {
  content: BlogContent | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogState = {
  content: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBlogContent = createAsyncThunk(
  'blog/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blogPage/fetchContent');
      if (!response.ok) {
        throw new Error('Failed to fetch blog content');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const updateBlogContent = createAsyncThunk(
  'blog/updateContent',
  async (content: BlogContent, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blogPage/updateContent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update blog content');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

// Slice
const blogPageSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optional: Add direct update reducers if needed
    updateHeroContent: (state, action: PayloadAction<Partial<HeroContent>>) => {
      if (state.content) {
        state.content.hero = { ...state.content.hero, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content cases
      .addCase(fetchBlogContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchBlogContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update content cases
      .addCase(updateBlogContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(updateBlogContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectBlogContent = (state: { blogPage: BlogState }) => state.blogPage.content;
export const selectBlogLoading = (state: { blogPage: BlogState }) => state.blogPage.loading;
export const selectBlogError = (state: { blogPage: BlogState }) => state.blogPage.error;

// Export actions and reducer
export const { clearError, updateHeroContent } = blogPageSlice.actions;
export default blogPageSlice.reducer;