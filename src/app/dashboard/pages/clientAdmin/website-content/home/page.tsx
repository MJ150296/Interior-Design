import React from "react";

const HomePage: React.FC = () => {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Riddhi Interiors</h1>
      <p className="text-lg mb-6">
        Discover elegant interior solutions tailored for your space in Dehradun. Explore our portfolio, services, and get inspired to transform your home or office.
      </p>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Services</h2>
        <ul className="list-disc pl-6">
          <li>Residential Interior Design</li>
          <li>Commercial Interior Design</li>
          <li>Custom Furniture & Decor</li>
          <li>Space Planning & Consultation</li>
        </ul>
      </section>
    </main>
  );
};

export default HomePage;