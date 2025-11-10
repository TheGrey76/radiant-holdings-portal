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
      // Handle both comma and semicolon separated files
      // Check if data is in a single column (wrong separator was used)
      let actualRow = row;
      
      // If there's only one key and it contains semicolons, split it
      const keys = Object.keys(row);
      if (keys.length === 1 && keys[0].includes(';')) {
        const singleValue = row[keys[0]];
        const headerParts = keys[0].split(';');
        const valueParts = singleValue.split(';');
        
        actualRow = {};
        headerParts.forEach((header: string, index: number) => {
          actualRow[header.trim()] = valueParts[index]?.trim() || '';
        });
      }
      
      // Now extract fields with correct column names
      const firstName = actualRow['NOME'] || actualRow['NOME '] || '';
      const lastName = actualRow['COGNOME'] || '';
      const fullName = Object.keys(actualRow).find(k => !k.trim() || k === '') ? actualRow[''] : '';
      const birthDate = actualRow['_1'] || Object.values(actualRow)[3] || null;
      const age = parseInt(actualRow["ETA'"] || actualRow['ETA'] || '0') || null;
      const city = actualRow['PAESE'] || null;
      const province = actualRow['PROV'] || null;
      const intermediary2021 = actualRow['INTERMEDIARIO 09/21'] || null;
      const intermediary2019 = actualRow['INTERMEDIARIO 2019'] || null;
      const phone = actualRow['_2'] || Object.values(actualRow)[9] || null;
      const email = actualRow['MAIL'] || null;
      const role = actualRow['RUOLO'] || null;
      const region = actualRow['REGIONE'] || null;
      const portfolio = actualRow['PTF'] || null;
      
      return {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: (fullName || `${lastName} ${firstName}`).trim(),
        birth_date: birthDate,
        age: age,
        city: city,
        province: province,
        intermediary: intermediary2021 || intermediary2019,
        phone: phone,
        email: email,
        role: role,
        region: region,
        portfolio: portfolio
      };
    }).filter(adviser => 
      // Filter out invalid entries (must have at least a name)
      (adviser.first_name || adviser.last_name || adviser.full_name) && adviser.full_name.length > 2
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