import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user is admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, query, table, data, filters, id, limit, offset, orderBy, orderDir } = await req.json();

    // Use service role for all DB operations
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");

    if (action === "list_tables") {
      const sql = `
        SELECT table_name, 
               (SELECT count(*) FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "table_schema") {
      const sql = `
        SELECT column_name, data_type, is_nullable, column_default, 
               character_maximum_length, numeric_precision
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${sanitize(table)}'
        ORDER BY ordinal_position;
      `;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "table_count") {
      const sql = `SELECT count(*)::int as total FROM public."${sanitize(table)}";`;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "read") {
      const lim = Math.min(limit || 50, 500);
      const off = offset || 0;
      const order = orderBy ? `ORDER BY "${sanitize(orderBy)}" ${orderDir === 'desc' ? 'DESC' : 'ASC'}` : '';
      let where = '';
      if (filters && filters.length > 0) {
        const clauses = filters.map((f: any) => {
          const col = sanitize(f.column);
          const val = f.value.replace(/'/g, "''");
          if (f.operator === 'eq') return `"${col}" = '${val}'`;
          if (f.operator === 'neq') return `"${col}" != '${val}'`;
          if (f.operator === 'gt') return `"${col}" > '${val}'`;
          if (f.operator === 'lt') return `"${col}" < '${val}'`;
          if (f.operator === 'like') return `"${col}"::text ILIKE '%${val}%'`;
          if (f.operator === 'is_null') return `"${col}" IS NULL`;
          if (f.operator === 'not_null') return `"${col}" IS NOT NULL`;
          return `"${col}"::text ILIKE '%${val}%'`;
        });
        where = `WHERE ${clauses.join(' AND ')}`;
      }
      const sql = `SELECT * FROM public."${sanitize(table)}" ${where} ${order} LIMIT ${lim} OFFSET ${off};`;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "insert") {
      const cols = Object.keys(data).map(k => `"${sanitize(k)}"`).join(', ');
      const vals = Object.values(data).map(v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`).join(', ');
      const sql = `INSERT INTO public."${sanitize(table)}" (${cols}) VALUES (${vals}) RETURNING *;`;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const sets = Object.entries(data)
        .map(([k, v]) => `"${sanitize(k)}" = ${v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`}`)
        .join(', ');
      const sql = `UPDATE public."${sanitize(table)}" SET ${sets} WHERE id = '${sanitize(id)}' RETURNING *;`;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const sql = `DELETE FROM public."${sanitize(table)}" WHERE id = '${sanitize(id)}' RETURNING id;`;
      const result = await executeSql(dbUrl!, sql);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "execute_sql") {
      // Block dangerous DDL unless it's a SELECT
      const trimmed = query.trim().toUpperCase();
      const blocked = ['DROP DATABASE', 'DROP SCHEMA', 'TRUNCATE', 'ALTER SYSTEM'];
      for (const b of blocked) {
        if (trimmed.includes(b)) {
          return new Response(JSON.stringify({ error: `Blocked operation: ${b}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      const result = await executeSql(dbUrl!, query);
      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "openapi_schema") {
      const tablesResult = await executeSql(dbUrl!, `
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;
      `);
      const schemas: Record<string, any> = {};
      const paths: Record<string, any> = {};

      for (const t of tablesResult) {
        const colsResult = await executeSql(dbUrl!, `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = '${t.table_name}'
          ORDER BY ordinal_position;
        `);
        const properties: Record<string, any> = {};
        const required: string[] = [];
        for (const col of colsResult) {
          properties[col.column_name] = {
            type: pgTypeToOpenApi(col.data_type),
            nullable: col.is_nullable === 'YES',
            ...(col.column_default ? { default: col.column_default } : {}),
          };
          if (col.is_nullable === 'NO' && !col.column_default) {
            required.push(col.column_name);
          }
        }
        schemas[t.table_name] = {
          type: 'object',
          properties,
          ...(required.length > 0 ? { required } : {}),
        };
        paths[`/rest/v1/${t.table_name}`] = {
          get: { summary: `List ${t.table_name}`, responses: { '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { '$ref': `#/components/schemas/${t.table_name}` } } } } } } },
          post: { summary: `Create ${t.table_name}`, requestBody: { content: { 'application/json': { schema: { '$ref': `#/components/schemas/${t.table_name}` } } } }, responses: { '201': { description: 'Created' } } },
        };
      }

      const openapi = {
        openapi: '3.0.3',
        info: { title: 'Aries76 Database API', version: '1.0.0', description: 'Auto-generated OpenAPI documentation for the Aries76 global database.' },
        servers: [{ url: `${supabaseUrl}`, description: 'Supabase API' }],
        paths,
        components: { schemas },
      };

      return new Response(JSON.stringify({ data: openapi }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin DB error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function sanitize(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, '');
}

function pgTypeToOpenApi(pgType: string): string {
  if (pgType.includes('int') || pgType === 'numeric' || pgType === 'real' || pgType === 'double precision') return 'number';
  if (pgType === 'boolean') return 'boolean';
  if (pgType.includes('json')) return 'object';
  if (pgType === 'ARRAY') return 'array';
  return 'string';
}

async function executeSql(dbUrl: string, sql: string): Promise<any[]> {
  const { Pool } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts");
  const pool = new Pool(dbUrl, 3, true);
  const connection = await pool.connect();
  try {
    const result = await connection.queryObject(sql);
    return result.rows as any[];
  } finally {
    connection.release();
    await pool.end();
  }
}
