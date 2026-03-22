import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { BlogContent } from "@/app/types/content/public";

interface BlogPageState {
  content: BlogContent | null;
  isDirty: boolean;
}

const initialState: BlogPageState = {
  content: null,
  isDirty: false,
};

const blogPageSlice = createSlice({
  name: "blogPage",
  initialState,
  reducers: {
    initializeContent(state, action: PayloadAction<BlogContent>) {
      state.content = action.payload;
      state.isDirty = false;
    },
    updateContent(state, action: PayloadAction<Partial<BlogContent>>) {
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

export const { initializeContent, updateContent, markSaved, resetContent } = blogPageSlice.actions;
export const selectBlogContent = (state: RootState) => state.blogPage.content;
export const selectBlogIsDirty = (state: RootState) => state.blogPage.isDirty;

export default blogPageSlice.reducer;