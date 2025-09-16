// src/app/redux/slices/appointmentFormSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface AppointmentFormData {
  title: string;
  description: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    contactNumber: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
  buttonText: string;
}

interface AppointmentFormState {
  formData: AppointmentFormData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentFormState = {
  formData: null,
  loading: false,
  error: null,
};

// Default values for AppointmentForm
export const defaultAppointmentForm: AppointmentFormData = {
  title: "Schedule Your Design Consultation",
  description:
    "Fill out the form below and our design team will contact you to discuss your project",
  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "your.email@example.com" },
    contactNumber: { label: "Contact Number", placeholder: "+91 123 456 7890" },
    message: { label: "Message", placeholder: "Tell us about your project..." },
  },
  buttonText: "Request Appointment",
};

// Async thunk to fetch appointment form content
export const fetchAppointmentForm = createAsyncThunk(
  "appointmentForm/fetchContent",
  async () => {
    const response = await fetch(
      "/api/website-content/appointmentForm/fetchContent"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch appointment form content");
    }    
    const data = await response.json();
    return data as AppointmentFormData;
  }
);

// Async thunk to update appointment form content
export const updateAppointmentForm = createAsyncThunk(
  "appointmentForm/updateContent",
  async (formData: AppointmentFormData) => {
    const response = await fetch(
      "/api/website-content/appointmentForm/updateContent",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update appointment form content");
    }

    const data = await response.json();
    return data as AppointmentFormData;
  }
);

// Create the slice
const appointmentFormSlice = createSlice({
  name: "appointmentForm",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetToDefault: (state) => {
      state.formData = defaultAppointmentForm;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reducers
      .addCase(fetchAppointmentForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointmentForm.fulfilled,
        (state, action: PayloadAction<AppointmentFormData>) => {
          state.loading = false;
          state.formData = action.payload;
        }
      )
      .addCase(fetchAppointmentForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch content";
        state.formData = defaultAppointmentForm;
      })
      // Update reducers
      .addCase(updateAppointmentForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAppointmentForm.fulfilled,
        (state, action: PayloadAction<AppointmentFormData>) => {
          state.loading = false;
          state.formData = action.payload;
        }
      )
      .addCase(updateAppointmentForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update content";
      });
  },
});

// Export actions and selectors
export const { clearError, resetToDefault } = appointmentFormSlice.actions;

export const selectAppointmentForm = (state: {
  appointmentForm: AppointmentFormState;
}) => state.appointmentForm.formData;
export const selectAppointmentFormLoading = (state: {
  appointmentForm: AppointmentFormState;
}) => state.appointmentForm.loading;
export const selectAppointmentFormError = (state: {
  appointmentForm: AppointmentFormState;
}) => state.appointmentForm.error;

export default appointmentFormSlice.reducer;
