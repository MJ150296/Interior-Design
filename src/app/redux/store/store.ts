// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import aboutUsPageReducer from "../slices/aboutUsPageSlice";
import portfolioPageReducer from "../slices/portfolioPageSlice";
import testimonialReducer from "../slices/testimonialPageSlice";
import contactPageReducer from "../slices/contactPageSlice";
import appointmentFormReducer from "../slices/appointmentFormSlice";
import blogPageReducer from "../slices/blogPageSlice";

export const store = configureStore({
  reducer: {
    aboutUsPage: aboutUsPageReducer,
    portfolioPage: portfolioPageReducer,
    testimonialPage: testimonialReducer,
    contactPage: contactPageReducer,
    appointmentForm: appointmentFormReducer,
    blogPage: blogPageReducer,
  },
  // Redux Toolkit automatically sets up the Redux DevTools extension and middleware
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
