// app/api/classifyWaste/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const product = formData.get('product');
    const imageFile = formData.get('image');

    if (!product && !imageFile) {
      return NextResponse.json({ error: 'Product name or image is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    // Updated to use gemini-1.5-flash model
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

    let requestBody = {
      contents: [{
        parts: []
      }]
    };

    // Add text prompt
    requestBody.contents[0].parts.push({
      text: `
        Classify the waste type of ${product ? `"${product}"` : 'the item in the image'} as:
        - Degradable, Biodegradable, or Non-degradable.
        - Provide storage and disposal instructions.
        - Suggest possible recycling methods.
        - Estimate resale value if applicable.
      `
    });

    // Add image if provided
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: imageFile.type,
          data: base64Image
        }
      });
    }

    const response = await axios.post(`${url}?key=${apiKey}`, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      maxBodyLength: Infinity,
    });

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI.";

    return NextResponse.json({ result: aiResponse });
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch AI response', details: error.response?.data || error.message }, 
      { status: error.response?.status || 500 }
    );
  }
}