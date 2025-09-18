"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import StoriesCard from "../components/StoriesCard";
import { deletestories, getAllstories } from "../api/CRUD";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Stories = () => {
    const [allStories, setAllStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [paginatedStories, setPaginatedStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3); // Items per page

    useEffect(() => {
        fetchAllStories();
    }, []);

    useEffect(() => {
        // Filter stories based on search query
        const filtered = allStories.filter(story => 
            story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStories(filtered);
        setCurrentPage(1);// Reset to first page when search changes
    }, [searchQuery, allStories]);

    useEffect(() => {
        // Paginate the filtered stories
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        console.log(startIndex)
        console.log(endIndex)
        setPaginatedStories(filteredStories.slice(startIndex, endIndex));
    }, [filteredStories, currentPage, itemsPerPage]);

    const fetchAllStories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllstories();
            setAllStories(response || []);
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
            toast.success("Story deleted", { position: "top-right" });
            const updatedStories = allStories.filter((story) => story.id !== id);
            setAllStories(updatedStories);
        } catch (err) {
            console.error("Error deleting story:", err);
            toast.error("Failed to delete story", { position: "top-right" });
        }
    };

    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <Helmet>
                <title>New York Lore – Discover the Untold Stories</title>
                <meta name="description" content="A New York Lore platform showcasing New York’s hidden street-art, urban legends, and community stories—through photos, videos, poems, sketches, and interactive features." />
            </Helmet>

            <div className="min-h-screen bg-gray-900 text-gray-100">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search stories..."
                                className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-300"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
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
                        <>
                            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedStories.length > 0 ? (
                                    paginatedStories.map((story) => (
                                        <StoriesCard
                                            key={story.id}
                                            stories={story}
                                            onDelete={deleteStory}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-gray-400 text-lg">
                                            {searchQuery ? "No matching stories found." : "No stories found."}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* Total Count */}
                            <div className="text-center mt-4 text-gray-400 text-sm">
                                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredStories.length)} of {filteredStories.length} stories
                            </div>
                        </>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 mt-12 py-8 border-t border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="text-center md:text-left">
                                <p className="text-gray-400 text-sm">© 2025 NewYorkLore. All rights reserved.</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">About</a>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact</a>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy</a>
                                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <ToastContainer />
        </>
    );
};

export default Stories;
