
'use client';
import { useState } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const classifyWaste = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/classifyWaste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
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
        <button 
          onClick={classifyWaste} 
          disabled={loading || !product.trim()}
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
