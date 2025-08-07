"use client";
import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import React, { useState, useEffect } from "react";

const ProfileSettings = () => {
  // State for personal information
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    fullName: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    profileImageUrl: "",
  });

  // State for password change
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const { user, clientAdmin } = await response.json();

        setPersonalInfo({
          email: user.email,
          fullName: clientAdmin?.fullName || "",
          contactNumber: clientAdmin?.contactNumber || "",
          address: {
            street: clientAdmin?.address?.street || "",
            city: clientAdmin?.address?.city || "",
            state: clientAdmin?.address?.state || "",
            postalCode: clientAdmin?.address?.postalCode || "",
          },
          profileImageUrl: user.profileImageUrl || "",
        });
      } catch (error) {
        setErrorMessage("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle personal info changes
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in personalInfo.address) {
      setPersonalInfo((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setPersonalInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit personal info updates
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalInfo),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      setSuccessMessage("Profile updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to update profile");
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update password: ${response.statusText}`);
      }

      setSuccessMessage("Password updated successfully!");
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to update password");
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading profile...</div>;
  }

  return (
    <DashboardLayoutClient>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Personal Information Section */}
        <form onSubmit={handlePersonalInfoSubmit} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={personalInfo.contactNumber}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                name="profileImageUrl"
                value={personalInfo.profileImageUrl}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={personalInfo.address.street}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={personalInfo.address.city}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={personalInfo.address.state}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={personalInfo.address.postalCode}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>

        {/* Password Update Section */}
        <form onSubmit={handlePasswordSubmit}>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordInfo.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordInfo.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className={`px-4 py-2 rounded ${
              isUpdatingPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isUpdatingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </DashboardLayoutClient>
  );
};

export default ProfileSettings;
