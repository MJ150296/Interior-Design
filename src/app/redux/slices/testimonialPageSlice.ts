import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { TestimonialContent } from "@/app/types/content/public";

interface TestimonialPageState {
  content: TestimonialContent | null;
  isDirty: boolean;
}

const initialState: TestimonialPageState = {
  content: null,
  isDirty: false,
};

const testimonialPageSlice = createSlice({
  name: "testimonialPage",
  initialState,
  reducers: {
    initializeContent(state, action: PayloadAction<TestimonialContent>) {
      state.content = action.payload;
      state.isDirty = false;
    },
    updateContent(state, action: PayloadAction<Partial<TestimonialContent>>) {
      if (state.content) {
        state.content = { ...state.content, ...action.payload };
        state.isDirty = true;
      }
    },
    markSaved(state) {
      state.isDirty = false;
    },
    resetContent(state) {
      state.content = null;
      state.isDirty = false;
    },
  },
});

export const { initializeContent, updateContent, markSaved, resetContent } = testimonialPageSlice.actions;
export const selectTestimonialContent = (state: RootState) => state.testimonialPage.content;
export const selectTestimonialIsDirty = (state: RootState) => state.testimonialPage.isDirty;

export default testimonialPageSlice.reducer;