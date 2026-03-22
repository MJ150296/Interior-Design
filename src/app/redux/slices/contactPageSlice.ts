import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ContactContent } from "@/app/types/content/public";

interface ContactPageState {
  content: ContactContent | null;
  isDirty: boolean;
}

const initialState: ContactPageState = {
  content: null,
  isDirty: false,
};

const contactPageSlice = createSlice({
  name: "contactPage",
  initialState,
  reducers: {
    initializeContent(state, action: PayloadAction<ContactContent>) {
      state.content = action.payload;
      state.isDirty = false;
    },
    updateContent(state, action: PayloadAction<Partial<ContactContent>>) {
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

export const { initializeContent, updateContent, markSaved, resetContent } = contactPageSlice.actions;
export const selectContactContent = (state: RootState) => state.contactPage.content;
export const selectContactIsDirty = (state: RootState) => state.contactPage.isDirty;

export default contactPageSlice.reducer;