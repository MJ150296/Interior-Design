import React from "react";
import { Typewriter } from "react-simple-typewriter";

const AnimatedService: React.FC = () => {
  const services = ["Full Home", "Kitchen", "Wardrobe"];
  return (
    <div className="w-full">
      {/* Animated Services Section */}
      <section className="rounded-lg text-white px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-lime-950">
            Get the estimate for your{" "}
            <span className="inline-block text-lime-500">
              <Typewriter
                words={services}
                loop={0} // infinite loop
                cursor
                cursorStyle="|"
                typeSpeed={125}
                deleteSpeed={100}
                delaySpeed={1500} // wait before deleting
              />
            </span>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default AnimatedService;
