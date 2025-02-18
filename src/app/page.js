'use client';
import { useState } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyWaste = async () => {
    if (!product && !image) return;
    
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('product', product);
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch('/api/classifyWaste', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to classify waste');
      }

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to fetch waste classification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Waste Classification AI</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto max-h-48 rounded"
              />
            </div>
          )}
        </div>

        <button 
          onClick={classifyWaste} 
          disabled={loading || (!product.trim() && !image)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Classifying...' : 'Classify Waste'}
        </button>
        
        {result && (
          <div className="result mt-4 p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
