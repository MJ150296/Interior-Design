import { configureStore } from "@reduxjs/toolkit";
import aboutUsReducer from "../slices/aboutUsPageSlice";
import portfolioReducer from "../slices/portfolioPageSlice";
import blogReducer from "../slices/blogPageSlice";
import contactReducer from "../slices/contactPageSlice";
import testimonialReducer from "../slices/testimonialPageSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      aboutUsPage: aboutUsReducer,
      portfolioPage: portfolioReducer,
      blogPage: blogReducer,
      contactPage: contactReducer,
      testimonialPage: testimonialReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];