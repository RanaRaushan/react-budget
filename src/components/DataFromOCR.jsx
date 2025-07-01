import { useState } from 'react';
import { buttonCSS } from '../utils/cssConstantHelper';
import { get_data_by_ocr } from '../utils/APIHelper';

const LOG_PREFIX = 'UploadDataByOCRComponent::';

export default function UploadDataByOCRComponent({ onDataFetched }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);
    setLoading(true);
    try {
      const response = await get_data_by_ocr(
        formData,
        new URLSearchParams({ receipt: 'dmart' }).toString(),
      );
      const result = response?.parsed_data;
      onDataFetched(result); // Send data to parent component
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Upload failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center bg-indigo-600 p-6 rounded-xl shadow border border-gray-200 gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block border border-gray-300 rounded px-3 py-2"
        disabled={loading}
      />
      <button onClick={handleUpload} disabled={loading} className={buttonCSS}>
        {loading ? 'Extracting...' : 'Upload & Extract'}
      </button>
      {message && (
        <p className={`text-center text-red-600 text-2xl font-bold`}>
          {message}
        </p>
      )}
    </div>
  );
}
