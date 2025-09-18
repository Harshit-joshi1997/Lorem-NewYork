"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaEdit, FaTrash } from "react-icons/fa";
import { BiShare } from "react-icons/bi";
import { getstoriesById } from "../api/CRUD";
import { ToastContainer, toast } from 'react-toastify';

const StoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            loadStory();
        }
    }, [id]);

    const loadStory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getstoriesById(id);
            setStory(data);
        } catch (err) {
            console.error("Error loading story:", err);
            setError("Failed to load story. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: story.title,
                    text: story.body?.substring(0, 100) + "...",
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this story?")) {
            try {
                // await deleteStory(id);
                navigate("/");
            } catch (err) {
                console.error("Error deleting story:", err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const estimateReadTime = (text) => {
        if (!text) return "1 min read";
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="bg-red-900 border border-red-700 text-red-300 px-6 py-4 rounded-lg max-w-md mx-auto mb-6">
                            {error || "Story not found"}
                        </div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
                        >
                            <FaArrowLeft /> Go Back Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{story.title} | New York Lore - Discover the Untold Stories</title>
                <meta name="description" content={story.body?.substring(0, 160)} />
            </Helmet>

            <div className="min-h-screen bg-gray-900 text-gray-100">
                {/* Header with Back Button */}
                <header className="border-b border-gray-700 bg-gray-800">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                <FaArrowLeft /> Back to Stories
                            </Link>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                                    title="Share story"
                                >
                                    <BiShare size={18} />
                                </button>
                                <Link
                                    to={`/editBlog/${story.id}`}
                                    className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white transition-colors"
                                    title="Edit story"
                                >
                                    <FaEdit size={16} />
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                                    title="Delete story"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image - Full Width */}
                {story.media && story.media.fileType && (
                    <div className="mb-4">
                        {story.media.fileType.match('image.*') ? (
                            <img
                                src={story.media.url}
                                alt="Story media"
                                className="w-full h-auto rounded-md"
                            />
                        ) : story.media.fileType.match('video.*') ? (
                            <video
                                muted
                                loop
                                src={story.media.url}
                                autoPlay
                                className="w-full h-auto rounded-md"
                            />
                        ) : (
                            <div className="text-gray-400 text-sm">
                                Unsupported media type: {stories.media.fileType}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content - No Card Container */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <article>
                        {/* Story Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                            <div className="flex items-center gap-2">
                                <FaUser className="text-emerald-400" />
                                <span>{story.name || story.author || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-emerald-400" />
                                <span>{formatDate(story.createdAt || story.date)}</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                <FaClock className="text-emerald-400" />
                <span>{estimateReadTime(story.body)}</span>
              </div> */}
                            {story.email && (
                                <div className="text-gray-500">
                                    <span>by {story.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 mb-6 leading-tight">
                            {story.title}
                        </h1>

                        {/* Subtitle */}
                        {story.subtitle && (
                            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed">
                                {story.subtitle}
                            </p>
                        )}

                        {/* Story Content */}
                        <div className="prose prose-lg prose-invert prose-emerald max-w-none">
                            <div className="text-gray-300 leading-relaxed space-y-6">
                                {story.body ? (
                                    story.body.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-lg md:text-xl leading-relaxed">
                                            {paragraph.trim()}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No content available.</p>
                                )}
                            </div>
                        </div>

                        {/* Story Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-700 text-emerald-200 flex items-center justify-center text-xl font-medium">
                                        {(story.name || story.author || "A").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-200 text-lg">
                                            {story.name || story.author || "Anonymous"}
                                        </p>
                                        {story.email && (
                                            <p className="text-gray-400">{story.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Share Button */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-lg"
                                >
                                    <BiShare /> Share Story
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Navigation */}
                    <div className="mt-12 flex justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-emerald-600 text-gray-300 hover:text-emerald-400 font-medium rounded-lg transition-all duration-300"
                        >
                            <FaArrowLeft /> Back to All Stories
                        </Link>
                    </div>
                </main>
            </div>

            <ToastContainer />
        </>
    );
};

export default StoryDetails;