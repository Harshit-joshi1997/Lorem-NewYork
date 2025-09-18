"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import StoriesCard from "../components/StoriesCard";
import { deletestories, getAllstories } from "../api/CRUD";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [stories, setStories] = useState([]);
  const [displayedStories, setDisplayedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllstories();
      setStories(data || []);

      // Sort by newest first and take first 6
      const sortedStories = [...(data || [])].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDisplayedStories(sortedStories.slice(0, 6));
    } catch (err) {
      console.error("Error loading stories:", err);
      setError("Failed to load stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    try {
      await deletestories(id);
      setStories((prev) => prev.filter((story) => story.id !== id));
      setDisplayedStories((prev) => prev.filter((story) => story.id !== id));
      toast.success("Story deleted", { position: "top-right" });
    } catch (err) {
      console.error("Error deleting story:", err);
      toast.error("Failed to delete story", { position: "top-right" });
    }
  };

  const handleLoadMore = () => {
    // Navigate to stories page
    navigate('/stories');
  };

  return (
    <>
      <Helmet>
        <title>New York Lore – Discover the Untold Stories</title>
        <meta name="description" content="A New York Lore platform showcasing New York’s hidden street-art, urban legends, and community stories—through photos, videos, poems, sketches, and interactive features." />
      </Helmet>

      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-emerald-400 sm:text-4xl sm:tracking-tight lg:text-5xl">
              Welcome To New York Lore
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-300">
              Explore the latest articles, poems and stories.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-12 text-center">
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-md mx-auto">
                {error}
              </div>
            </div>
          )}

          {/* Stories Grid */}
          {!loading && !error && (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedStories.length > 0 ? (
                displayedStories.map((story) => (
                  <StoriesCard
                    key={story.id}
                    stories={story}
                    onDelete={deleteStory}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No stories found.</p>
                </div>
              )}
            </div>
          )}

          {/* Load More Button - Only show if there are more stories than displayed */}
          {!loading && !error && stories.length > displayedStories.length && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-emerald-600 text-gray-300 hover:text-emerald-400 font-medium rounded-lg transition-all duration-300"
              >
                Load More Stories
              </button>
            </div>
          )}
        </main>
      </div>

      <ToastContainer />
    </>
  );
};

export default Home;