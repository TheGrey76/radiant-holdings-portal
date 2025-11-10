import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, FileText, Search, ExternalLink, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ImportAdvisersDialog from "@/components/ImportAdvisersDialog";
import BackToTop from "@/components/BackToTop";
import EditAdviserDialog from "@/components/EditAdviserDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialAdviser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  age: number;
  city: string;
  province: string;
  intermediary: string;
  phone: string;
  email: string;
  role: string;
  region: string;
  portfolio: string;
  linkedinUrl: string;
}

export default function FinancialAdvisersPortal() {
  const [financialAdvisers, setFinancialAdvisers] = useState<FinancialAdviser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [intermediaryFilter, setIntermediaryFilter] = useState("all");

  useEffect(() => {
    fetchAdvisers();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data && !error);
  };

  const fetchAdvisers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_advisers')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;

      if (data) {
        const mappedData: FinancialAdviser[] = data.map(adviser => ({
          id: adviser.id,
          firstName: adviser.first_name,
          lastName: adviser.last_name,
          fullName: adviser.full_name,
          birthDate: adviser.birth_date || '',
          age: adviser.age || 0,
          city: adviser.city || '',
          province: adviser.province || '',
          intermediary: adviser.intermediary || '',
          phone: adviser.phone || '',
          email: adviser.email || '',
          role: adviser.role || '',
          region: adviser.region || '',
          portfolio: adviser.portfolio || '',
          linkedinUrl: adviser.linkedin_url || ''
        }));
        setFinancialAdvisers(mappedData);
      }
    } catch (error) {
      console.error('Error fetching advisers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdvisers = financialAdvisers.filter(adviser => {
    const matchesSearch = 
      adviser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.intermediary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adviser.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === "all" || adviser.region === regionFilter;
    const matchesIntermediary = intermediaryFilter === "all" || adviser.intermediary === intermediaryFilter;
    
    return matchesSearch && matchesRegion && matchesIntermediary;
  });

  const uniqueRegions = Array.from(new Set(financialAdvisers.map(a => a.region))).filter(Boolean);
  const uniqueIntermediaries = Array.from(new Set(financialAdvisers.map(a => a.intermediary))).filter(Boolean);

  const statsCards = [
    {
      title: "Total Advisers",
      value: financialAdvisers.length.toString(),
      icon: Building2,
      description: "Financial advisers in database"
    },
    {
      title: "Regions",
      value: uniqueRegions.length.toString(),
      icon: MapPin,
      description: "Geographic coverage"
    },
    {
      title: "Intermediaries",
      value: uniqueIntermediaries.length.toString(),
      icon: TrendingUp,
      description: "Partner institutions"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] flex items-center justify-center">
        <div className="text-white text-xl">Loading advisers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      <Navbar />
      <BackToTop />
      
      <div className="container mx-auto px-6 py-24 pt-32 max-w-7xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-light text-white">Financial Advisers Portal</h1>
              {isAdmin && (
                <Badge className="bg-primary text-white border-primary/20">
                  ADMIN MODE
                </Badge>
              )}
            </div>
            <p className="text-white/60 text-lg">Access our network of financial advisers and investment professionals</p>
          </div>
          <ImportAdvisersDialog onImportComplete={fetchAdvisers} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <p className="text-xs text-white/60 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="advisers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="advisers" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
              Financial Advisers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisers" className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        placeholder="Search advisers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 text-white border-white/20 placeholder:text-white/50 hover:bg-white/15 focus:bg-white/15"
                      />
                    </div>
                  </div>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[200px] bg-white/10 text-white border-white/20 hover:bg-white/15">
                      <SelectValue placeholder="Filter by Region" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1729] border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">All Regions</SelectItem>
                      {uniqueRegions.map(region => (
                        <SelectItem key={region} value={region} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={intermediaryFilter} onValueChange={setIntermediaryFilter}>
                    <SelectTrigger className="w-[250px] bg-white/10 text-white border-white/20 hover:bg-white/15">
                      <SelectValue placeholder="Filter by Intermediary" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1729] border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">All Intermediaries</SelectItem>
                      {uniqueIntermediaries.map(intermediary => (
                        <SelectItem key={intermediary} value={intermediary} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">{intermediary}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-white/60">
                  Showing {filteredAdvisers.length} of {financialAdvisers.length} advisers
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70 w-[200px]">Adviser</TableHead>
                        <TableHead className="text-white/70 w-[180px]">Intermediary</TableHead>
                        <TableHead className="text-white/70 w-[140px]">Location</TableHead>
                        <TableHead className="text-white/70 w-[180px]">Contact Info</TableHead>
                        <TableHead className="text-white/70 w-[120px]">Details</TableHead>
                        {isAdmin && <TableHead className="text-white/70 w-[80px]">Edit</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdvisers.map((adviser, index) => (
                        <TableRow key={index} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium text-sm">{adviser.fullName}</div>
                              <div className="text-xs text-white/60">Age: {adviser.age}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="text-xs truncate max-w-[180px]" title={adviser.intermediary}>
                              {adviser.intermediary}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div>
                              <div className="text-sm">{adviser.city}</div>
                              <div className="text-xs text-white/60">{adviser.province}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="space-y-1">
                              {adviser.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-white/60" />
                                  <a href={`mailto:${adviser.email}`} className="text-xs text-white/80 hover:text-white hover:underline truncate max-w-[160px]" title={adviser.email}>
                                    {adviser.email}
                                  </a>
                                </div>
                              )}
                              {adviser.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-white/60" />
                                  <a href={`tel:${adviser.phone}`} className="text-xs text-white/80 hover:text-white hover:underline">
                                    {adviser.phone}
                                  </a>
                                </div>
                              )}
                              {adviser.linkedinUrl && (
                                <div className="flex items-center gap-1">
                                  <Linkedin className="h-3 w-3 text-white/60" />
                                  <a href={adviser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/80 hover:text-white hover:underline">
                                    LinkedIn
                                  </a>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="space-y-1">
                              {adviser.role && (
                                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                                  {adviser.role}
                                </Badge>
                              )}
                              {adviser.portfolio && (
                                <div className="text-xs text-white/60">{adviser.portfolio}</div>
                              )}
                            </div>
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <EditAdviserDialog adviser={adviser} onUpdate={fetchAdvisers} />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Distribution by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueRegions.map(region => {
                      const count = financialAdvisers.filter(a => a.region === region).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={region} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{region}</span>
                            <span className="text-white/60">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Top Intermediaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniqueIntermediaries.slice(0, 5).map(intermediary => {
                      const count = financialAdvisers.filter(a => a.intermediary === intermediary).length;
                      const percentage = ((count / financialAdvisers.length) * 100).toFixed(1);
                      return (
                        <div key={intermediary} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white truncate flex-1">{intermediary}</span>
                            <span className="text-white/60 ml-2">{count}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
