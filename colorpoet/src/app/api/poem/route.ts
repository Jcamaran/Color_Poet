import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  console.log('🎨 Poem API called');
  try {
    const { color, colorName } = await request.json();
    console.log('📝 Request data:', { color, colorName });

    if (!color || !colorName) {
      console.error('Missing color or colorName');
      return NextResponse.json(
        { error: 'Color and color name are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('API key found, initializing Gemini...');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });

    const monthlySourcePoems = {

    }
    
    // Generate poem
    const prompt = `Write a short, beautiful poem (4-6 lines) inspired by the color "${colorName}" (${color}). The poem should evoke the emotions, imagery, and feelings associated with this color. Be creative and poetic. Do not include a title, just the poem itself.`;
    
    console.log('Calling Gemini API...');
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.9,           // High creativity
        topK: 40,                   // Consider top 40 tokens
        topP: 0.95,                 // Nucleus sampling
        maxOutputTokens: 100,       // Limit poem length
      }
    });
    
    console.log('Response received:', response);
    const poem = response.text;
    console.log(' Poem generated successfully');

    return NextResponse.json({ poem, color, colorName });
    
  } catch (error) {
    console.error('Error generating poem:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
