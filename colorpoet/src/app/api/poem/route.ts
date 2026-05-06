import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  console.log('Poem API called');
  try {
    const { color, colorName, sourcePoem, sourcePoemTitle, sourcePoemAuthor } = await request.json();
    console.log('Request data:', { color, colorName, sourcePoem: sourcePoem?.substring(0, 50) + '...' });

    if (!color || !colorName || !sourcePoem) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Color, color name, and source poem are required' },
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

   
    
    // Generate poem with source included
    const prompt = `You are a poet. Rewrite the following poem to match the vibe and emotion of the color ${colorName} (${color}).

ORIGINAL POEM:
"${sourcePoemTitle}" by ${sourcePoemAuthor}
${sourcePoem}

INSTRUCTIONS:
- Keep EXACTLY the same number of lines (${sourcePoem.split('\n').length} lines)
- Keep similar line lengths to the original
- Adapt the imagery, metaphors, and mood to reflect the color ${colorName}
- Preserve the rhythm and structure
- Make it feel like the color ${colorName}

Return ONLY the rewritten poem, no title, no explanations, just the poem lines:`;
    
    console.log('Calling Gemini API...');
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.9,           // High creativity
        topK: 40,                   // Consider top 40 tokens
        topP: 0.95,                 // Nucleus sampling
        maxOutputTokens: 200,       // Limit poem length
      }
    });
    
    console.log('Response received:', response);
    const poem = response.text;
    console.log('Poem generated successfully');

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
