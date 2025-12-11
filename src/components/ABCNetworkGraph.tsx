import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Network, ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  categoria: string;
  citta?: string;
  status: string;
  pipelineValue: number;
  approvalStatus: string;
}

interface Node {
  id: string;
  name: string;
  company: string;
  category: string;
  city: string;
  status: string;
  pipelineValue: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Link {
  source: string;
  target: string;
  type: "company" | "category" | "city";
  strength: number;
}

interface ABCNetworkGraphProps {
  investors: Investor[];
}

const STATUS_COLORS: Record<string, string> = {
  "To Contact": "#64748b",
  "Contacted": "#3b82f6",
  "Interested": "#eab308",
  "Meeting Scheduled": "#a855f7",
  "In Negotiation": "#f97316",
  "Closed": "#22c55e",
  "Not Interested": "#ef4444",
};

const LINK_COLORS: Record<string, string> = {
  company: "#3b82f6",
  category: "#22c55e",
  city: "#a855f7",
};

export function ABCNetworkGraph({ investors }: ABCNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [linkFilters, setLinkFilters] = useState({
    company: true,
    category: true,
    city: false,
  });
  const [nodes, setNodes] = useState<Node[]>([]);
  const animationRef = useRef<number>();

  // Filter approved investors
  const filteredInvestors = useMemo(() => 
    investors.filter(inv => inv.approvalStatus !== "not_approved"),
    [investors]
  );

  // Build nodes and links
  const { initialNodes, links } = useMemo(() => {
    const maxPipeline = Math.max(...filteredInvestors.map(i => i.pipelineValue || 1), 1);
    
    const nodeList: Node[] = filteredInvestors.map((inv, index) => {
      const angle = (2 * Math.PI * index) / filteredInvestors.length;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
      return {
        id: inv.id,
        name: inv.nome,
        company: inv.azienda,
        category: inv.categoria,
        city: inv.citta || "",
        status: inv.status,
        pipelineValue: inv.pipelineValue || 0,
        x: dimensions.width / 2 + Math.cos(angle) * radius,
        y: dimensions.height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: Math.max(8, Math.min(25, 8 + (inv.pipelineValue / maxPipeline) * 17)),
      };
    });

    const linkList: Link[] = [];
    
    // Build links based on shared attributes
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const a = nodeList[i];
        const b = nodeList[j];
        
        // Same company
        if (a.company === b.company && a.company) {
          linkList.push({ source: a.id, target: b.id, type: "company", strength: 0.8 });
        }
        // Same category
        if (a.category === b.category && a.category) {
          linkList.push({ source: a.id, target: b.id, type: "category", strength: 0.5 });
        }
        // Same city
        if (a.city === b.city && a.city) {
          linkList.push({ source: a.id, target: b.id, type: "city", strength: 0.3 });
        }
      }
    }

    return { initialNodes: nodeList, links: linkList };
  }, [filteredInvestors, dimensions]);

  // Simple static layout - no continuous animation
  useEffect(() => {
    if (initialNodes.length === 0) return;

    // Calculate active links for simulation
    const simulationLinks = links.filter(link => 
      (link.type === "company" && linkFilters.company) ||
      (link.type === "category" && linkFilters.category) ||
      (link.type === "city" && linkFilters.city)
    );

    // Run simulation only once at start
    const iterations = 50;
    const simulatedNodes = initialNodes.map(node => ({ ...node }));
    
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < simulatedNodes.length; i++) {
        const node = simulatedNodes[i];
        let fx = 0, fy = 0;
        
        // Gentle center gravity
        fx += (dimensions.width / 2 - node.x) * 0.002;
        fy += (dimensions.height / 2 - node.y) * 0.002;
        
        // Repulsion between nodes
        for (let j = 0; j < simulatedNodes.length; j++) {
          if (i === j) continue;
          const other = simulatedNodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = node.radius + other.radius + 30;
          
          if (dist < minDist * 1.5) {
            const force = (minDist - dist) / dist * 0.1;
            fx += dx * force;
            fy += dy * force;
          }
        }
        
        // Link attraction (gentle)
        simulationLinks.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const otherId = link.source === node.id ? link.target : link.source;
            const other = simulatedNodes.find(n => n.id === otherId);
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              fx += dx * 0.002 * link.strength;
              fy += dy * 0.002 * link.strength;
            }
          }
        });
        
        // Apply forces
        node.x += fx;
        node.y += fy;
        
        // Keep within bounds
        node.x = Math.max(node.radius + 10, Math.min(dimensions.width - node.radius - 10, node.x));
        node.y = Math.max(node.radius + 10, Math.min(dimensions.height - node.radius - 10, node.y));
      }
    }
    
    setNodes(simulatedNodes);
  }, [initialNodes, links, linkFilters, dimensions]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 500,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Filter active links
  const activeLinks = useMemo(() => 
    links.filter(link => 
      (link.type === "company" && linkFilters.company) ||
      (link.type === "category" && linkFilters.category) ||
      (link.type === "city" && linkFilters.city)
    ),
    [links, linkFilters]
  );

  // Stats
  const stats = useMemo(() => ({
    totalNodes: nodes.length,
    totalLinks: activeLinks.length,
    companyLinks: links.filter(l => l.type === "company").length,
    categoryLinks: links.filter(l => l.type === "category").length,
    cityLinks: links.filter(l => l.type === "city").length,
  }), [nodes, activeLinks, links]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
    return `€${value}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <CardTitle>Investor Network Graph</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtri
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Tipi di Connessione</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="company" 
                        checked={linkFilters.company}
                        onCheckedChange={(checked) => setLinkFilters(f => ({ ...f, company: !!checked }))}
                      />
                      <Label htmlFor="company" className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        Stessa Azienda ({stats.companyLinks})
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="category" 
                        checked={linkFilters.category}
                        onCheckedChange={(checked) => setLinkFilters(f => ({ ...f, category: !!checked }))}
                      />
                      <Label htmlFor="category" className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        Stessa Categoria ({stats.categoryLinks})
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="city" 
                        checked={linkFilters.city}
                        onCheckedChange={(checked) => setLinkFilters(f => ({ ...f, city: !!checked }))}
                      />
                      <Label htmlFor="city" className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-purple-500" />
                        Stessa Città ({stats.cityLinks})
                      </Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Zoom Controls */}
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-2">
          <Badge variant="secondary">{stats.totalNodes} Investitori</Badge>
          <Badge variant="outline">{stats.totalLinks} Connessioni</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={containerRef} 
          className="relative bg-muted/30 rounded-lg overflow-hidden"
          style={{ height: 500 }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Links */}
              {activeLinks.map((link, index) => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return null;
                
                return (
                  <line
                    key={`link-${index}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={LINK_COLORS[link.type]}
                    strokeWidth={1.5}
                    strokeOpacity={0.3}
                  />
                );
              })}
              
              {/* Nodes */}
              {nodes.map((node) => (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <circle
                    r={node.radius}
                    fill={STATUS_COLORS[node.status] || "#64748b"}
                    stroke={selectedNode === node.id ? "#fff" : "transparent"}
                    strokeWidth={3}
                    opacity={selectedNode && selectedNode !== node.id ? 0.3 : 1}
                  />
                  {zoom > 0.8 && (
                    <text
                      y={node.radius + 12}
                      textAnchor="middle"
                      className="text-[10px] fill-foreground pointer-events-none"
                      opacity={0.8}
                    >
                      {node.name.split(" ")[0]}
                    </text>
                  )}
                </g>
              ))}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredNode && (
            <div 
              className="absolute bg-popover border rounded-lg shadow-lg p-3 pointer-events-none z-10"
              style={{
                left: Math.min(hoveredNode.x * zoom + pan.x + 20, dimensions.width - 200),
                top: Math.min(hoveredNode.y * zoom + pan.y - 20, dimensions.height - 120),
              }}
            >
              <p className="font-semibold text-foreground">{hoveredNode.name}</p>
              <p className="text-sm text-muted-foreground">{hoveredNode.company}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="text-xs" style={{ backgroundColor: STATUS_COLORS[hoveredNode.status] }}>
                  {hoveredNode.status}
                </Badge>
              </div>
              <div className="mt-2 text-sm">
                <p>Pipeline: <span className="font-semibold">{formatCurrency(hoveredNode.pipelineValue)}</span></p>
                <p>Categoria: {hoveredNode.category}</p>
                {hoveredNode.city && <p>Città: {hoveredNode.city}</p>}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Legenda Status</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
