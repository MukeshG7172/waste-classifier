import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY; // Remove NEXT_PUBLIC_ prefix
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

    const requestBody = {
      contents: [{
        parts: [{
          text: `
            Classify the waste type of "${product}" as:
            - Degradable, Biodegradable, or Non-degradable.
            - Provide storage and disposal instructions.
            - Suggest possible recycling methods.
            - Estimate resale value if applicable.
          `
        }]
      }]
    };

    const response = await axios.post(`${url}?key=${apiKey}`, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI.";

    return NextResponse.json({ result: aiResponse });
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' }, 
      { status: error.response?.status || 500 }
    );
  }
}