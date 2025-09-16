// src/app/redux/slices/testimonialPageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

// Define TypeScript interfaces
export interface Testimonial {
  id: number;
  imageUrl: string;
  category: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface HeroContent {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
}

export interface Category {
  name: string;
}

export interface CtaContent {
  title: string;
  description: string;
}

export interface TestimonialContent {
  hero: HeroContent;
  categories: Category[];
  testimonials: Testimonial[];
  stats: Stat[];
  cta: CtaContent;
}

interface TestimonialState {
  content: TestimonialContent | null;
  loading: boolean;
  error: string | null;
}

// Default values
const defaultValues: TestimonialContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "CLIENT EXPERIENCES",
    title: "Designed with Trust",
    subtitle:
      "Stories of Spaces Transformed, Lives Touched, and Dreams Designed.",
  },
  categories: [
    { name: "All" },
  ],
  testimonials: [
    {
      id: 1,
      imageUrl: "/Riddhi Interior Design/masonry-4.jpg",
      category: "Residential",
      quote:
        "Riddhi Interior Design turned our empty flat into a warm and stylish home. Their attention to detail is unmatched!",
      author: "Anita Sharma",
      role: "Homeowner, Noida",
      rating: 5,
    },
    {
      id: 2,
      imageUrl: "/Riddhi Interior Design/why-choose-us.jpg",
      category: "Commercial",
      quote:
        "Our office space reflects professionalism and creativity now — exactly what we wanted. Highly recommend their team.",
      author: "Rajeev Mehta",
      role: "Founder, Mehta & Co.",
      rating: 5,
    },
  ],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Years Experience" },
    { value: "50+", label: "Awards Received" },
  ],
  cta: {
    title: "Ready to Transform Your Space?",
    description:
      "Join hundreds of satisfied clients who have experienced the Riddhi Interiors difference. Schedule your consultation today.",
  },
};

// Initial state
const initialState: TestimonialState = {
  content: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTestimonialContent = createAsyncThunk(
  "testimonial/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/website-content/testimonialPage/fetchContent"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch testimonial content");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

export const updateTestimonialContent = createAsyncThunk(
  "testimonial/updateContent",
  async (content: TestimonialContent, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/website-content/testimonialPage/updateContent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Failed to update testimonial content");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

// Slice
const testimonialPageSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    resetTestimonialError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchTestimonialContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTestimonialContent.fulfilled,
        (state, action: PayloadAction<TestimonialContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(fetchTestimonialContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.content = defaultValues; // Fallback to default values
      })
      // Update content
      .addCase(updateTestimonialContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTestimonialContent.fulfilled,
        (state, action: PayloadAction<TestimonialContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(updateTestimonialContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { resetTestimonialError } = testimonialPageSlice.actions;

// Selectors
export const selectTestimonialContent = (state: RootState) =>
  state.testimonialPage.content || defaultValues;
export const selectTestimonialLoading = (state: RootState) =>
  state.testimonialPage.loading;
export const selectTestimonialError = (state: RootState) =>
  state.testimonialPage.error;

export default testimonialPageSlice.reducer;
