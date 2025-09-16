// src/app/redux/slices/contactPageSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Update the ContactContent interface to match the component
// In your contactPageSlice.ts, update the ContactContent interface:
export interface ContactContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  whyChooseUs: {
    title: string;
    description: string;
    tabs: Array<{
      title: string; // Tab title
      icon: string; // Tab icon
      contentTitle: string; // Content title
      description: string; // Content description
    }>;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  contactInfo: {
    items: Array<{
      icon: string;
      title: string;
      details: string;
    }>;
  };
}

// Define the state interface
interface ContactPageState {
  content: ContactContent | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ContactPageState = {
  content: null,
  loading: false,
  error: null,
};

// Update default values to match component structure
export const defaultContactContent: ContactContent = {
  hero: {
    title: "Design Your Dream Space",
    subtitle:
      "Schedule a consultation with our expert interior designers to transform your home or office",
    buttonText: "Book Free Consultation", // Add this field
  },
  whyChooseUs: {
    title: "Why Choose Riddhi Interiors?",
    description:
      "We combine creativity, expertise, and attention to detail to deliver exceptional interior solutions",
    tabs: [
      {
        title: "Consultation",
        icon: "phone",
        contentTitle: "Expert Consultation Process",
        description:
          "Our process begins with understanding your vision, preferences, and requirements through an in-depth consultation.",
      },
      {
        title: "Design Process",
        icon: "settings",
        contentTitle: "Innovative Design Approach",
        description:
          "We create detailed design concepts and 3D visualizations to bring your vision to life before implementation.",
      },
      {
        title: "Materials",
        icon: "award",
        contentTitle: "Premium Material Selection",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        title: "Execution",
        icon: "calendar",
        contentTitle: "Flawless Project Execution",
        description:
          "Our skilled craftsmen and project managers ensure flawless execution of your design vision.",
      },
    ],
    features: [
      {
        icon: "palette",
        title: "Expert Design Consultation",
        description:
          "Our experienced designers will work with you to create spaces that reflect your personality and lifestyle.",
      },
      {
        icon: "award",
        title: "Premium Quality Materials",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        icon: "house",
        title: "End-to-End Project Management",
        description:
          "From concept to completion, we handle every detail so you can relax and enjoy the transformation.",
      },
      {
        icon: "calendar",
        title: "Personalized Solutions",
        description:
          "Every space is unique - we create custom solutions tailored to your specific needs and preferences.",
      },
    ],
  },
  contactInfo: {
    items: [
      {
        icon: "phone",
        title: "Call Us",
        details: "+91 78959 27366",
      },
      {
        icon: "map-pin",
        title: "Visit Us",
        details: "Tilak Road, Dehradun",
      },
      {
        icon: "clock",
        title: "Working Hours",
        details: "Mon-Sat: 10AM - 7PM",
      },
    ],
  },
};

// Async thunk to fetch contact content
export const fetchContactContent = createAsyncThunk(
  "contactPage/fetchContent",
  async () => {
    const response = await fetch(
      "/api/website-content/contactPage/fetchContent"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch contact page content");
    }
    const data = await response.json();
    return data as ContactContent;
  }
);

// Async thunk to update contact content
export const updateContactContent = createAsyncThunk(
  "contactPage/updateContent",
  async (content: ContactContent) => {
    const response = await fetch(
      "/api/website-content/contactPage/updateContent",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update contact page content");
    }

    const data = await response.json();
    return data as ContactContent;
  }
);

// Create the slice
const contactPageSlice = createSlice({
  name: "contactPage",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetToDefault: (state) => {
      state.content = defaultContactContent;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reducers
      .addCase(fetchContactContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContactContent.fulfilled,
        (state, action: PayloadAction<ContactContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(fetchContactContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch content";
        // Set default content if fetch fails
        state.content = defaultContactContent;
      })
      // Update reducers
      .addCase(updateContactContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateContactContent.fulfilled,
        (state, action: PayloadAction<ContactContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(updateContactContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update content";
      });
  },
});

// Export actions and selectors
export const { clearError, resetToDefault } = contactPageSlice.actions;

export const selectContactContent = (state: {
  contactPage: ContactPageState;
}) => state.contactPage.content;
export const selectContactLoading = (state: {
  contactPage: ContactPageState;
}) => state.contactPage.loading;
export const selectContactError = (state: { contactPage: ContactPageState }) =>
  state.contactPage.error;

export default contactPageSlice.reducer;
