const API_BASE_URL = import.meta.env.VITE_API_URL; 
const API_ENDPOINT = `${API_BASE_URL}/stories`;

// CREATE - Add a new stories
export const addstories = async (storiesData) => {
  try {
    console.log('Adding story with data:', storiesData);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: storiesData.name,
        email: storiesData.email,
        title: storiesData.title,
        body: storiesData.body,
        badge: storiesData.badge,
        media: storiesData.media ? {
          publicId: storiesData.media.publicId,
          url: storiesData.media.url,
          fileType: storiesData.media.fileType,
          format: storiesData.media.format
        } : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: Date.now().toString()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Story added successfully:', result);
    return result;
  } catch (error) {
    console.error('Error adding story:', error);
    return null;
  }
};

// READ - Get all stories
export const getAllstories = async () => {
  try {
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stories = await response.json();
    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

// READ - Get single stories by ID
export const getstoriesById = async (id) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stories = await response.json();
    return stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return null;
  }
};

// UPDATE - Update existing stories
export const updatestories = async (id, storiesData) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...storiesData,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating stories:', error);
    return null;
  }
};

// DELETE - Delete stories by ID
export const deletestories = async (id) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting stories:', error);
    return false;
  }
};

// SORT - Get stories sorted by field
export const getSortedstories = async (sortBy = 'createdAt', order = 'desc') => {
  try {
    const response = await fetch(`${API_ENDPOINT}?_sort=${sortBy}&_order=${order}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stories = await response.json();
    return stories;
  } catch (error) {
    console.error('Error fetching sorted stories:', error);
    return [];
  }
};


// NEWSLETTER - Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/newsletter-subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return null;
  }
};
