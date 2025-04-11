import React from "react";
import PlacesLinks from "../components/Location/PlacesLinks";

const LocationPage: React.FC = () => {
  return (
    <div className="w-full p-5">
      {/* Background image with heading */}
      <div
        className="w-full h-[450px] rounded-2xl bg-cover bg-start flex items-center justify-center"
        style={{
          backgroundImage: `url('/KitchenRO1.jpg')`, // Replace with your actual image path
        }}
      >
        <h1 className="px-10 rounded-2xl text-5xl bg-linear-to-r from-blue-400 via-blue-600 to-blue-400 font-bold text-white drop-shadow-lg">
          Our Location
        </h1>
      </div>
      <PlacesLinks />
    </div>
  );
};

export default LocationPage;
