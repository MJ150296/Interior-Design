import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { AboutContent } from "@/app/types/content/about";

interface AboutUsPageState {
  content: AboutContent | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutUsPageState = {
  content: null,
  loading: false,
  error: null,
};

// Async thunk for fetching about page content
export const fetchAboutContent = createAsyncThunk(
  "aboutUsPage/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/website-content/aboutUsPage/fetchContent"
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch content");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk to update about page content
export const updateAboutContent = createAsyncThunk(
  "aboutUsPage/updateContent",
  async (content: AboutContent, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/website-content/aboutUsPage/updateContent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update content");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const aboutUsPageSlice = createSlice({
  name: "aboutUsPage",
  initialState,
  reducers: {
    // Synchronous action for setting content
    setContent(state, action: PayloadAction<AboutContent>) {
      state.content = action.payload;
    },
    // Reset to initial state
    resetContent(state) {
      state.content = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch content cases
    builder
      .addCase(fetchAboutContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAboutContent.fulfilled,
        (state, action: PayloadAction<AboutContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(fetchAboutContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update content cases
      .addCase(updateAboutContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAboutContent.fulfilled,
        (state, action: PayloadAction<AboutContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(updateAboutContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setContent, resetContent } = aboutUsPageSlice.actions;
export const selectAboutContent = (state: RootState) =>
  state.aboutUsPage.content;
export const selectAboutLoading = (state: RootState) =>
  state.aboutUsPage.loading;
export const selectAboutError = (state: RootState) => state.aboutUsPage.error;

export default aboutUsPageSlice.reducer;
