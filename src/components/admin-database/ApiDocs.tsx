import { useState, useEffect } from "react";
import { useAdminDatabase } from "@/hooks/useAdminDatabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileJson, ChevronRight, ChevronDown } from "lucide-react";

export default function ApiDocs() {
  const db = useAdminDatabase();
  const [schema, setSchema] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    db.getOpenApiSchema().then(s => s && setSchema(s));
  }, []);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-muted-foreground">
        {db.loading ? "Loading OpenAPI schema..." : "Failed to load schema"}
      </div>
    );
  }

  const paths = Object.entries(schema.paths || {}).filter(([path]) =>
    path.toLowerCase().includes(search.toLowerCase())
  );
  const schemas = Object.entries(schema.components?.schemas || {}).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              {schema.info?.title || "API Documentation"}
            </h2>
            <p className="text-sm text-muted-foreground">{schema.info?.description}</p>
          </div>
          <Badge variant="outline">OpenAPI {schema.openapi}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search endpoints or schemas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Server info */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Server</h3>
            {schema.servers?.map((s: any, i: number) => (
              <div key={i} className="text-xs font-mono bg-muted/50 px-3 py-2 rounded">
                {s.url} <span className="text-muted-foreground ml-2">— {s.description}</span>
              </div>
            ))}
          </div>

          {/* Endpoints */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Endpoints ({paths.length})</h3>
            <div className="space-y-1">
              {paths.map(([path, methods]: [string, any]) => (
                <div key={path} className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => togglePath(path)}
                    className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
                  >
                    {expandedPaths.has(path) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-mono text-xs flex-1">{path}</span>
                    <div className="flex gap-1">
                      {Object.keys(methods).map(m => (
                        <Badge key={m} variant={m === "get" ? "secondary" : "default"} className="text-[10px] uppercase">{m}</Badge>
                      ))}
                    </div>
                  </button>
                  {expandedPaths.has(path) && (
                    <div className="border-t px-4 py-3 bg-muted/20 space-y-3">
                      {Object.entries(methods).map(([method, details]: [string, any]) => (
                        <div key={method}>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={method === "get" ? "secondary" : "default"} className="text-[10px] uppercase">{method}</Badge>
                            <span className="text-sm font-medium">{details.summary}</span>
                          </div>
                          {details.requestBody?.content?.["application/json"]?.schema?.$ref && (
                            <p className="text-xs text-muted-foreground">Body: <code className="bg-muted px-1 rounded">{details.requestBody.content["application/json"].schema.$ref.split("/").pop()}</code></p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schemas */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Schemas ({schemas.length})</h3>
            <div className="space-y-1">
              {schemas.map(([name, schema]: [string, any]) => (
                <div key={name} className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => togglePath(`schema_${name}`)}
                    className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors"
                  >
                    {expandedPaths.has(`schema_${name}`) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-mono text-xs">{name}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      {Object.keys(schema.properties || {}).length} fields
                    </Badge>
                  </button>
                  {expandedPaths.has(`schema_${name}`) && (
                    <div className="border-t bg-muted/20">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left px-4 py-1.5 font-medium text-muted-foreground">Field</th>
                            <th className="text-left px-4 py-1.5 font-medium text-muted-foreground">Type</th>
                            <th className="text-left px-4 py-1.5 font-medium text-muted-foreground">Nullable</th>
                            <th className="text-left px-4 py-1.5 font-medium text-muted-foreground">Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(schema.properties || {}).map(([field, info]: [string, any]) => (
                            <tr key={field} className="border-b last:border-0">
                              <td className="px-4 py-1.5 font-mono">{field} {schema.required?.includes(field) && <span className="text-destructive">*</span>}</td>
                              <td className="px-4 py-1.5"><Badge variant="outline" className="text-[10px]">{info.type}</Badge></td>
                              <td className="px-4 py-1.5">{info.nullable ? "Yes" : "No"}</td>
                              <td className="px-4 py-1.5 text-muted-foreground max-w-[200px] truncate">{info.default || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
