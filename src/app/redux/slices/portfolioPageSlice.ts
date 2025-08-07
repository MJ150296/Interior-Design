// src/app/redux/portfolioPageSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  PortfolioContent,
  Project,
} from "@/app/dashboard/pages/clientAdmin/website-content/portfolio/page";

interface PortfolioPageState {
  content: PortfolioContent | null;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioPageState = {
  content: null,
  loading: false,
  error: null,
};

// Async thunk for fetching portfolio content
export const fetchPortfolioContent = createAsyncThunk(
  "portfolioPage/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/website-content/portfolioPage/fetchContent"
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

// Async thunk to update portfolio content
export const updatePortfolioContent = createAsyncThunk(
  "portfolioPage/updateContent",
  async (content: PortfolioContent, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/website-content/portfolioPage/updateContent",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        }
      );

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

const portfolioPageSlice = createSlice({
  name: "portfolioPage",
  initialState,
  reducers: {
    // Update any field in the portfolio content
    updateField: (
      state,
      action: PayloadAction<{
        section: keyof PortfolioContent;
        field: string;
        value: unknown;
        index?: number;
      }>
    ) => {
      if (!state.content) return;

      const { section, field, value, index } = action.payload;

      if (index !== undefined) {
        // Handle array fields (projects, quotes, stats)
        const sectionArray = state.content[section];
        if (Array.isArray(sectionArray)) {
          const updatedArray = [...sectionArray];
          if (index < updatedArray.length) {
            updatedArray[index] = {
              ...updatedArray[index],
              [field]: value,
            };
            state.content = {
              ...state.content,
              [section]: updatedArray,
            };
          }
        }
      } else {
        // Handle object fields (hero, cta)
        state.content = {
          ...state.content,
          [section]: {
            ...(state.content[section] as object),
            [field]: value,
          },
        };
      }
    },

    // Add a new quote
    addQuote: (state) => {
      if (state.content) {
        state.content.quotes.push({
          text: "",
          author: "",
        });
      }
    },

    // Remove a quote
    removeQuote: (state, action: PayloadAction<number>) => {
      if (state.content) {
        state.content.quotes.splice(action.payload, 1);
      }
    },

    // Add a new project (residential or commercial)
    addProject: (
      state,
      action: PayloadAction<"residential" | "commercial">
    ) => {
      if (!state.content) return;

      const type = action.payload;
      const projectType = `${type}Projects` as keyof PortfolioContent;
      const projects = state.content[projectType] as Project[];

      state.content = {
        ...state.content,
        [projectType]: [
          ...projects,
          {
            id: projects.length + 1,
            title: `New ${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Project ${projects.length + 1}`,
            location: "",
            category: "",
            imageUrl: "",
            hoverTitle: "",
            hoverDescription: "",
          },
        ],
      };
    },

    // Remove a project (residential or commercial)
    removeProject: (
      state,
      action: PayloadAction<{
        type: "residential" | "commercial";
        index: number;
      }>
    ) => {
      if (!state.content) return;

      const { type, index } = action.payload;
      const projectType = `${type}Projects` as keyof PortfolioContent;
      const projects = [...(state.content[projectType] as Project[])];
      projects.splice(index, 1);

      state.content = {
        ...state.content,
        [projectType]: projects,
      };
    },

    // Add a new stat
    addStat: (state) => {
      if (state.content) {
        state.content.stats.push({ value: "", label: "" });
      }
    },

    // Remove a stat
    removeStat: (state, action: PayloadAction<number>) => {
      if (state.content) {
        state.content.stats.splice(action.payload, 1);
      }
    },

    // Reset to initial state
    resetContent: (state) => {
      state.content = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch content cases
    builder
      .addCase(fetchPortfolioContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPortfolioContent.fulfilled,
        (state, action: PayloadAction<PortfolioContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(fetchPortfolioContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update content cases
      .addCase(updatePortfolioContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePortfolioContent.fulfilled,
        (state, action: PayloadAction<PortfolioContent>) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addCase(updatePortfolioContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateField,
  addQuote,
  removeQuote,
  addProject,
  removeProject,
  addStat,
  removeStat,
  resetContent,
} = portfolioPageSlice.actions;

export const selectPortfolioContent = (state: RootState) =>
  state.portfolioPage.content;
export const selectPortfolioLoading = (state: RootState) =>
  state.portfolioPage.loading;
export const selectPortfolioError = (state: RootState) =>
  state.portfolioPage.error;

export default portfolioPageSlice.reducer;
