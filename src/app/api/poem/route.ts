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

Return your response as a valid JSON object with this EXACT structure:
{
  "title": "a new poetic title inspired by the color",
  "poem": "the rewritten poem text here with \n for line breaks",
  "colorMeanings": ["word1", "word2", "word3"],
  "poemType": "style name"
}

The title should be a new poetic title inspired by the color ${colorName} and similar in style to "${sourcePoemTitle}".
The colorMeanings should be 3-4 single words that represent the symbolic meaning of the color ${colorName} (e.g., "growth", "calm", "energy").
The poemType should be the style of poem you generated (e.g., "haiku", "free verse", "sonnet", "limerick", "lyric").

Return ONLY valid JSON, nothing else.`;
    
    console.log('Calling Gemini API...');
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.9,           // High creativity
        topK: 40,                   // Consider top 40 tokens
        topP: 0.95,                 // Nucleus sampling
        maxOutputTokens: 300,       // Increased for JSON structure
      }
    });
    
    console.log('Response received:', response);
    const responseText = response.text;
    
    // Parse JSON response with fallback
    let poem: string;
    let title: string;
    let colorMeanings: string[] = [];
    let poemType: string = 'poem';
    
    if (!responseText) {
      throw new Error('Empty response from AI');
    }
    
    try {
      // Clean potential markdown code blocks and extra text
      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Try to extract JSON if there's extra text before/after
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(cleanedText);
      
      // Extract and clean the poem field
      poem = parsedResponse.poem || '';
      
      // Remove any JSON artifacts or extra formatting from the poem
      poem = poem
        .replace(/\\n/g, '\n')  // Convert escaped newlines
        .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
        .trim();
      
      // Extract and clean the title field
      title = parsedResponse.title || 'Untitled';
      title = title
        .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
        .replace(/\\(.)/g, '$1')  // Unescape any escaped characters
        .trim();
      
      colorMeanings = parsedResponse.colorMeanings || [];
      poemType = parsedResponse.poemType || 'poem';
      
      console.log('Poem generated successfully with metadata');
      console.log('Title:', title);
      console.log('Poem preview:', poem.substring(0, 100) + '...');
      
      return NextResponse.json({ poem, title, color, colorName, colorMeanings, poemType });
    } catch (parseError) {
      console.warn('Failed to parse JSON, using fallback:', parseError);
      console.log('Raw response:', responseText.substring(0, 200));
      
      // Fallback: try to extract poem and title from text
      let fallbackPoem = responseText;
      let fallbackTitle = 'Untitled';
      
      // Try to find title content
      const titleMatch = responseText.match(/"title"\s*:\s*"([^"]*)"/i);
      if (titleMatch) {
        fallbackTitle = titleMatch[1]
          .replace(/\\(.)/g, '$1')  // Unescape characters
          .trim();
      }
      
      // Try to find poem content between quotes
      const poemMatch = responseText.match(/"poem"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
      if (poemMatch) {
        fallbackPoem = poemMatch[1].replace(/\\n/g, '\n').trim();
      } else {
        // Remove any JSON-like syntax
        fallbackPoem = responseText
          .replace(/^\{.*?"poem"\s*:\s*"/i, '')
          .replace(/".*\}$/i, '')
          .replace(/\\n/g, '\n')
          .trim();
      }
      
      poem = fallbackPoem;
      title = fallbackTitle;
      
      console.log('Fallback title:', title);
      console.log('Fallback poem preview:', poem.substring(0, 100) + '...');
      
      return NextResponse.json({ poem, title, color, colorName, colorMeanings, poemType });
    }
    
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
