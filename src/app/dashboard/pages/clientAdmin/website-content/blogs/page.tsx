import React from "react";

const BlogsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <p className="mb-6 text-gray-700">
        Welcome to the Blogs section. Here you can manage and view all your website blog posts.
      </p>
      {/* Blog list or management UI can be added here */}
      <div className="border rounded p-4 bg-white shadow">
        <p className="text-gray-500">No blogs available yet. Start by adding a new blog post!</p>
      </div>
    </div>
  );
};

export default BlogsPage;