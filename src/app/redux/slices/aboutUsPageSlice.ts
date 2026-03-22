import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { AboutContent } from "@/app/types/content/about";

interface AboutUsPageState {
  content: AboutContent | null;
  isDirty: boolean;
}

const initialState: AboutUsPageState = {
  content: null,
  isDirty: false,
};

const aboutUsPageSlice = createSlice({
  name: "aboutUsPage",
  initialState,
  reducers: {
    // Initialize from SSR data
    initializeContent(state, action: PayloadAction<AboutContent>) {
      state.content = action.payload;
      state.isDirty = false;
    },
    // Update content locally (for form changes)
    updateContent(state, action: PayloadAction<Partial<AboutContent>>) {
      if (state.content) {
        state.content = { ...state.content, ...action.payload };
        state.isDirty = true;
      }
    },
    // Mark as saved
    markSaved(state) {
      state.isDirty = false;
    },
    // Reset to initial state
    resetContent(state) {
      state.content = null;
      state.isDirty = false;
    },
  },
});

export const { initializeContent, updateContent, markSaved, resetContent } = aboutUsPageSlice.actions;
export const selectAboutContent = (state: RootState) => state.aboutUsPage.content;
export const selectAboutIsDirty = (state: RootState) => state.aboutUsPage.isDirty;

export default aboutUsPageSlice.reducer;