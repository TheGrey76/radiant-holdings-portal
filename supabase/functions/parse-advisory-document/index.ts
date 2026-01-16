import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentSection {
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'image' | 'callout' | 'divider' | 'blockquote';
  content?: string;
  level?: number;
  items?: string[];
  ordered?: boolean;
  rows?: string[][];
  headers?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  variant?: 'info' | 'warning' | 'success' | 'insight';
}

// Parse XML-based DOCX content into structured sections
function parseDocxContent(xmlContent: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  
  // Extract paragraphs with their styles
  const paragraphRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g;
  let match;
  
  while ((match = paragraphRegex.exec(xmlContent)) !== null) {
    const paragraphXml = match[1];
    
    // Check for heading styles
    const styleMatch = paragraphXml.match(/<w:pStyle w:val="([^"]+)"/);
    const style = styleMatch ? styleMatch[1] : null;
    
    // Extract text content
    const textContent = extractTextFromParagraph(paragraphXml);
    
    if (!textContent.trim()) continue;
    
    // Determine section type based on style
    if (style?.includes('Heading') || style?.includes('Title')) {
      const levelMatch = style.match(/(\d+)/);
      const level = levelMatch ? parseInt(levelMatch[1]) : 1;
      sections.push({
        type: 'heading',
        content: textContent.trim(),
        level: Math.min(level, 4),
      });
    } else if (paragraphXml.includes('<w:numPr>')) {
      // This is a list item - we'll group them later
      const lastSection = sections[sections.length - 1];
      if (lastSection?.type === 'list') {
        lastSection.items?.push(textContent.trim());
      } else {
        sections.push({
          type: 'list',
          items: [textContent.trim()],
          ordered: paragraphXml.includes('w:numId'),
        });
      }
    } else {
      sections.push({
        type: 'paragraph',
        content: textContent.trim(),
      });
    }
  }
  
  // Parse tables
  const tableRegex = /<w:tbl>([\s\S]*?)<\/w:tbl>/g;
  let tableMatch;
  let tableIndex = 0;
  
  while ((tableMatch = tableRegex.exec(xmlContent)) !== null) {
    const tableXml = tableMatch[1];
    const rows = parseTableRows(tableXml);
    
    if (rows.length > 0) {
      // Find appropriate position for table (after first paragraph that might reference it)
      const insertIndex = Math.min(sections.length, 5 + tableIndex * 3);
      sections.splice(insertIndex, 0, {
        type: 'table',
        headers: rows[0],
        rows: rows.slice(1),
      });
      tableIndex++;
    }
  }
  
  return sections;
}

function extractTextFromParagraph(paragraphXml: string): string {
  const textParts: string[] = [];
  const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let textMatch;
  
  while ((textMatch = textRegex.exec(paragraphXml)) !== null) {
    textParts.push(textMatch[1]);
  }
  
  return textParts.join('');
}

function parseTableRows(tableXml: string): string[][] {
  const rows: string[][] = [];
  const rowRegex = /<w:tr[^>]*>([\s\S]*?)<\/w:tr>/g;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(tableXml)) !== null) {
    const rowXml = rowMatch[1];
    const cells: string[] = [];
    const cellRegex = /<w:tc[^>]*>([\s\S]*?)<\/w:tc>/g;
    let cellMatch;
    
    while ((cellMatch = cellRegex.exec(rowXml)) !== null) {
      const cellXml = cellMatch[1];
      cells.push(extractTextFromParagraph(cellXml));
    }
    
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  
  return rows;
}

// Enhanced parsing using simple heuristics for plain text fallback
function parseTextContent(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = text.split('\n');
  let currentList: string[] = [];
  let isOrderedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check for headings (lines that are all caps or end with colon)
    if (line.toUpperCase() === line && line.length > 3 && line.length < 100) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: currentList, ordered: isOrderedList });
        currentList = [];
      }
      sections.push({ type: 'heading', content: line, level: 1 });
    }
    // Check for subheadings (lines ending with colon)
    else if (line.endsWith(':') && line.length < 80) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: currentList, ordered: isOrderedList });
        currentList = [];
      }
      sections.push({ type: 'heading', content: line.slice(0, -1), level: 2 });
    }
    // Check for numbered list items
    else if (/^\d+[\.\)]\s/.test(line)) {
      if (currentList.length > 0 && !isOrderedList) {
        sections.push({ type: 'list', items: currentList, ordered: false });
        currentList = [];
      }
      isOrderedList = true;
      currentList.push(line.replace(/^\d+[\.\)]\s/, ''));
    }
    // Check for bullet points
    else if (/^[-•*]\s/.test(line)) {
      if (currentList.length > 0 && isOrderedList) {
        sections.push({ type: 'list', items: currentList, ordered: true });
        currentList = [];
      }
      isOrderedList = false;
      currentList.push(line.replace(/^[-•*]\s/, ''));
    }
    // Regular paragraph
    else {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: currentList, ordered: isOrderedList });
        currentList = [];
      }
      sections.push({ type: 'paragraph', content: line });
    }
  }
  
  if (currentList.length > 0) {
    sections.push({ type: 'list', items: currentList, ordered: isOrderedList });
  }
  
  return sections;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { filePath, documentId } = await req.json();

    if (!filePath || !documentId) {
      return new Response(
        JSON.stringify({ error: 'Missing filePath or documentId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Parsing document: ${filePath} for document ID: ${documentId}`);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('advisory-assets')
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read the file as array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let sections: DocumentSection[] = [];
    
    // Check if it's a DOCX file (ZIP format with specific signature)
    const isDocx = uint8Array[0] === 0x50 && uint8Array[1] === 0x4B;
    
    if (isDocx) {
      // For DOCX, we need to extract the document.xml from the ZIP
      // Using a simple approach to find and extract the main content
      const textContent = new TextDecoder().decode(uint8Array);
      
      // Look for the document.xml content within the ZIP
      const docXmlStart = textContent.indexOf('<w:document');
      const docXmlEnd = textContent.indexOf('</w:document>');
      
      if (docXmlStart !== -1 && docXmlEnd !== -1) {
        const xmlContent = textContent.substring(docXmlStart, docXmlEnd + '</w:document>'.length);
        sections = parseDocxContent(xmlContent);
      } else {
        // Fallback: extract any readable text
        const cleanText = textContent
          .replace(/[^\x20-\x7E\n\r]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        sections = parseTextContent(cleanText);
      }
    } else {
      // Plain text or RTF - parse as text
      const textContent = new TextDecoder().decode(uint8Array);
      sections = parseTextContent(textContent);
    }

    console.log(`Parsed ${sections.length} sections`);

    // Update the document with parsed content
    const { error: updateError } = await supabase
      .from('strategic_advisory_documents')
      .update({ content: sections })
      .eq('id', documentId);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sectionsCount: sections.length,
        sections: sections.slice(0, 5), // Return first 5 sections as preview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});