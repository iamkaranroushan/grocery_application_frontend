import axios from 'axios';

const uploadImageToCloudinary = async (file) => {
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dalok10hh/image/upload';
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;  // Make sure it's stored in your .env.local as NEXT_PUBLIC

    try {
        // Prepare the form data to send to Cloudinary
        const formData = new FormData();
        formData.append('file', file); // The file to upload
        formData.append('upload_preset', UPLOAD_PRESET); // The preset you created in Cloudinary
        formData.append('subcategory_images', 'subcategory-images'); // Optional: Specify the folder where to save images in Cloudinary

        // Send the request to Cloudinary
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Get the URL of the uploaded image
        const imageUrl = response.data.secure_url;
        return imageUrl;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return null;  // Return null if something went wrong
    }
};

export default uploadImageToCloudinary;
