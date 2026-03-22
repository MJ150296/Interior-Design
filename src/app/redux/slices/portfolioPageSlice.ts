import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { PortfolioContent } from "@/app/types/content/portfolio";

interface PortfolioPageState {
  content: PortfolioContent | null;
  isDirty: boolean;
}

const initialState: PortfolioPageState = {
  content: null,
  isDirty: false,
};

const portfolioPageSlice = createSlice({
  name: "portfolioPage",
  initialState,
  reducers: {
    initializeContent(state, action: PayloadAction<PortfolioContent>) {
      state.content = action.payload;
      state.isDirty = false;
    },
    updateContent(state, action: PayloadAction<Partial<PortfolioContent>>) {
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

export const { initializeContent, updateContent, markSaved, resetContent } = portfolioPageSlice.actions;
export const selectPortfolioContent = (state: RootState) => state.portfolioPage.content;
export const selectPortfolioIsDirty = (state: RootState) => state.portfolioPage.isDirty;

export default portfolioPageSlice.reducer;