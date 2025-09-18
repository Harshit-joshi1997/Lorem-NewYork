"use client";

import { Helmet } from "react-helmet";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { addstories, getAllstories, getstoriesById, updatestories } from "../api/CRUD";

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dcevzhfy9'
  }
});

const StoriesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [storyForm, setStoryForm] = useState({
    name: "",
    email: "",
    title: "",
    body: "",
    badge: "",
    media: null,
  });

  const [storiesList, setStoriesList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showstoriesList, setShowstoriesList] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  console.log("storiesList ",storiesList, "show stories list ", showstoriesList)
  useEffect(() => {
    loadstories();
    if (id) {
      handleEditFromParams(id);
    }
  }, [id]);

  const loadstories = async () => {
    try {
      const data = await getAllstories();
      setStoriesList(data);
    } catch (error) {
      toast.error("Failed to load stories", { position: "top-right" });
      console.error("Load stories error:", error);
    }
  };

  const handleEditFromParams = async (id) => {
    try {
      const storiesData = await getstoriesById(id);
      if (storiesData) {
        setStoryForm({
          name: storiesData.name || "",
          email: storiesData.email || "",
          title: storiesData.title || "",
          body: storiesData.body || "",
          badge: storiesData.badge || "",
          media: storiesData.media || null,
        });
        setEditingId(id);
        setShowstoriesList(false);
      }
    } catch (error) {
      toast.error("Failed to load story", { position: "top-right" });
      console.error("Edit from params error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Block special characters in name and title
    if (name === 'name' || name === 'title') {
      const regex = /^[a-zA-Z0-9\s.,'"-]*$/;
      if (!regex.test(value)) {
        toast.error(`Special characters are not allowed in ${name === 'name' ? 'author name' : 'title'}`);
        return;
      }
    }
    
    setStoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.match('image.*') && !file.type.match('video.*')) {
        toast.error("Only images and videos are allowed");
        return;
      }

      try {
        setIsUploading(true);
        const toastId = toast.loading("Uploading media...", { position: "top-right" });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'stories_upload');
        formData.append('folder', 'TechAssignment');
        formData.append('public_id', `${Date.now()}_${file.name.split('.')[0]}`);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dcevzhfy9/upload`,
          { method: 'POST', body: formData }
        );

        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

        setStoryForm(prev => ({
          ...prev,
          media: {
            publicId: data.public_id,
            url: data.secure_url,
            fileType: data.resource_type,
            format: data.format
          }
        }));

        toast.update(toastId, {
          render: "Media uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } catch (error) {
        toast.error(`Upload failed: ${error.message}`);
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate title length (max 100 characters)
    if (storyForm.title.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }
    
    if (storyForm.body.length > 2000) {
      toast.error("Story content must be 2000 characters or less");
      return;
    }
    
    try {
      if (editingId) {
        const data = await updatestories(editingId, storyForm);
        if (data) {
          toast.success("Story updated successfully");
          resetForm();
          navigate("/");
        }
      } else {
        const data = await addstories(storyForm);
        if (data) {
          toast.success("Story added successfully");
          resetForm();
        }
      }
      loadstories();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  };

  const resetForm = () => {
    setStoryForm({
      name: "",
      email: "",
      title: "",
      body: "",
      badge: "",
      media: null,
    });
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = () => {
    setStoryForm(prev => ({ ...prev, media: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelEdit = () => {
    resetForm();
    navigate("/");
    toast.info("Edit cancelled");
  };

  return (
    <>
      <Helmet>
        <title>Submit Stories | New York Lore</title>
        <meta name="description" content="Share your New York stories through photos, videos, and more." />
      </Helmet>
      <div className="overflow-hidden min-h-screen">
        <div className="flex items-center min-h-screen justify-center bg-gray-900 text-white px-10">
          <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
              {editingId ? "Edit Story" : "Add New Story"}
            </h2>

            {editingId && (
              <div className="text-center mb-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-400 transition"
                >
                  Cancel Edit
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Author Name <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 ml-2">(No special characters)</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none"
                    value={storyForm.name}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-400 mt-1">{storyForm.name.length}/50 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none"
                    value={storyForm.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Title <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 ml-2">(No special characters)</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none"
                    value={storyForm.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-400 mt-1">{storyForm.title.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Badge <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="badge"
                    value={storyForm.badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none"
                    required
                  >
                    <option value="">Select a badge - Required</option>
                    <option value="Article">Article</option>
                    <option value="Poems">Poems</option>
                    <option value="Stories">Stories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    {storyForm.media ? "Replace Media" : "Upload Image or Video"}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none cursor-pointer disabled:opacity-50"
                    onChange={handleMediaChange}
                  />
                  <p className="text-xs text-gray-400 mt-1">Supports images and videos (max 5MB)</p>

                  {storyForm.media && storyForm.media.publicId && (
                    <div className="mb-4 mt-2">
                      {storyForm.media.fileType === 'image' ? (
                        <AdvancedImage
                          key={`img-${storyForm.media.publicId}`}
                          cldImg={cld.image(storyForm.media.publicId)}
                          className="w-full h-auto rounded-md"
                          alt="Story media"
                        />
                      ) : (
                        <AdvancedVideo
                          key={`vid-${storyForm.media.publicId}`}
                          cldVid={cld.video(storyForm.media.publicId)}
                          className="w-full h-auto rounded-md"
                          autoPlay
                          muted
                          loop
                        />
                      )}
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="mt-2 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-400 transition"
                        disabled={isUploading}
                      >
                        Remove Media
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Story Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="body"
                  className="w-full h-[375px] px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-green-500 outline-none resize-none"
                  value={storyForm.body}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">{storyForm.body.length}/2000 characters</p>
                <button
                  type="submit"
                  className="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-400 transition mt-4"
                  disabled={isUploading}
                >
                  {editingId ? "Update Story" : "Add Story"}
                </button>
                <Link to="/stories">
                  <button
                    type="button"
                    className="w-full mt-2 py-2 text-white bg-green-500 rounded-md hover:bg-green-400 transition"
                  >
                    Show All Stories
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default StoriesForm;
