import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the CSV data from request body
    const { csvData } = await req.json();
    
    if (!csvData || !Array.isArray(csvData)) {
      throw new Error('Invalid CSV data format');
    }

    console.log(`Processing ${csvData.length} advisers...`);

    // Map CSV columns to database columns and prepare data
    const advisersToInsert = csvData.map((row: any) => {
      // Extract full name parts
      const fullName = row[''] || row['NOME COMPLETO'] || '';
      const firstName = row['NOME'] || row['NOME '] || '';
      const lastName = row['COGNOME'] || '';
      
      return {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: fullName.trim() || `${lastName.trim()} ${firstName.trim()}`.trim(),
        birth_date: row['_1'] || null, // Birth date column
        age: parseInt(row["ETA'"] || row['ETA'] || '0') || null,
        city: row['PAESE'] || null,
        province: row['PROV'] || null,
        intermediary: row['INTERMEDIARIO 09/21'] || row['INTERMEDIARIO 2019'] || null,
        phone: row['_2'] || null, // Phone column
        email: row['MAIL'] || null,
        role: row['RUOLO'] || null,
        region: row['REGIONE'] || null,
        portfolio: row['PTF'] || null
      };
    }).filter(adviser => 
      // Filter out invalid entries (must have at least a name)
      adviser.first_name || adviser.last_name || adviser.full_name
    );

    console.log(`Inserting ${advisersToInsert.length} valid advisers...`);

    // Insert in batches of 100 to avoid timeout
    const batchSize = 100;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < advisersToInsert.length; i += batchSize) {
      const batch = advisersToInsert.slice(i, i + batchSize);
      
      const { data, error } = await supabaseClient
        .from('financial_advisers')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Batch ${i / batchSize + 1} error:`, error);
        errors += batch.length;
      } else {
        inserted += batch.length;
        console.log(`Batch ${i / batchSize + 1} inserted: ${batch.length} records`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Import completed: ${inserted} advisers inserted, ${errors} errors`,
        inserted,
        errors,
        total: advisersToInsert.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error importing advisers:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});