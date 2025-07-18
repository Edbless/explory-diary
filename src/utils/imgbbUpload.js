/**
 * Upload image to ImgBB
 * @param {File} file - The image file to upload
 * @param {string} name - Optional name for the image
 * @returns {Promise<string>} - Returns the image URL
 */
export const uploadToImgBB = async (file, name = null) => {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('ImgBB API key not configured');
  }

  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check file size (ImgBB has a 32MB limit, but we'll keep it reasonable)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }

  try {
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    if (name) {
      formData.append('name', name);
    }

    // Upload to ImgBB
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    // Return the image URL
    return data.data.url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    
    if (error.message.includes('HTTP error')) {
      throw new Error('Failed to connect to image service. Please check your internet connection.');
    } else if (error.message.includes('API key')) {
      throw new Error('Image service configuration error. Please contact support.');
    } else {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }
};

/**
 * Convert file to base64 (alternative method if needed)
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/jpeg;base64, part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Upload image to ImgBB using base64 (alternative method)
 * @param {File} file 
 * @param {string} name 
 * @returns {Promise<string>}
 */
export const uploadToImgBBBase64 = async (file, name = null) => {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('ImgBB API key not configured');
  }

  try {
    const base64 = await fileToBase64(file);
    
    const formData = new FormData();
    formData.append('image', base64);
    
    if (name) {
      formData.append('name', name);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.data.url;
  } catch (error) {
    console.error('ImgBB base64 upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};