import { useCallback } from 'react';
import mime from 'mime';

const useImageUpload = () => {
  const createFormData = useCallback((uri: string): FormData => {
    const newImageUri = `file:///${uri.split('file:/').join('')}`;
    const formData = new FormData();

    formData.append('image', {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split('/').pop(),
    });

    return formData;
  }, []);

  const sendPicture = useCallback(async (formData: FormData) => {
    return fetch('https://phridge.herokuapp.com/api/search-ingredients', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

  return { createFormData, sendPicture };
};

export default useImageUpload;
