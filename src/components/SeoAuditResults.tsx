import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp, Shield, BarChart3, Info, TrendingDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface AuditData {
  id: number;
  name: string;
  description: string;
  weight: number;
  status: boolean | null;
  score: number | null;
  data: any;
}

export interface AuditSummary {
  totalAudits: number;
  totalWeight: number;
  totalScore: number;
  scorePercentage: number;
  passedAudits: number;
  failedAudits: number;
  pendingAudits: number;
}

export interface SeoAuditData {
  timestamp: string;
  url: string;
  domain: string;
  audits: { [key: string]: AuditData };
  summary: AuditSummary;
  topIssues: AuditData[];
  quickWins: AuditData[];
}

interface SeoAuditResultsProps {
  data: SeoAuditData;
  isLoading?: boolean;
}

export const SeoAuditResults = ({ data, isLoading }: SeoAuditResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'from-green-50 to-green-100 border-green-200';
    if (percentage >= 60) return 'from-yellow-50 to-yellow-100 border-yellow-200';
    return 'from-red-50 to-red-100 border-red-200';
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Clock className="w-4 h-4 text-gray-500" />;
    if (status) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Pending</Badge>;
    if (status) return <Badge variant="default" className="bg-green-600">Passed</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  // Chart data preparation
  const pieChartData = [
    { name: 'Passed', value: data.summary.passedAudits, color: '#16a34a' },
    { name: 'Failed', value: data.summary.failedAudits, color: '#dc2626' },
    { name: 'Pending', value: data.summary.pendingAudits, color: '#6b7280' }
  ];

  const categoryData = Object.values(data.audits).reduce((acc, audit) => {
    const category = getCategoryFromAudit(audit);
    if (!acc[category]) {
      acc[category] = { passed: 0, failed: 0, pending: 0 };
    }
    if (audit.status === true) acc[category].passed++;
    else if (audit.status === false) acc[category].failed++;
    else acc[category].pending++;
    return acc;
  }, {} as Record<string, {passed: number, failed: number, pending: number}>);

  const barChartData = Object.entries(categoryData).map(([category, counts]) => ({
    category,
    passed: counts.passed,
    failed: counts.failed,
    pending: counts.pending
  }));

  function getCategoryFromAudit(audit: AuditData): string {
    const name = audit.name.toLowerCase();
    if (name.includes('title') || name.includes('meta') || name.includes('h1') || name.includes('heading')) return 'Content';
    if (name.includes('image') || name.includes('alt')) return 'Images';
    if (name.includes('link') || name.includes('url') || name.includes('canonical')) return 'Links';
    if (name.includes('mobile') || name.includes('speed') || name.includes('ssl')) return 'Technical';
    if (name.includes('schema') || name.includes('structured')) return 'Schema';
    return 'Other';
  }

  // Get all audits for detailed info
  const allAudits = Object.values(data.audits);

  return (
    <div className="space-y-6">
      {/* Overall Score Section */}
      <Card className={`bg-gradient-to-r ${getScoreBg(data.summary.scorePercentage)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            SEO Audit Results for {data.domain}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main Score */}
            <div className="md:col-span-1 text-center">
              <div className={`text-4xl font-bold ${getScoreColor(data.summary.scorePercentage)}`}>
                {data.summary.scorePercentage}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
              <Progress 
                value={data.summary.scorePercentage} 
                className="mt-2"
              />
            </div>

            {/* Stats Grid */}
            <div className="md:col-span-3 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">{data.summary.passedAudits}</div>
                <p className="text-xs text-gray-600">Passed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-red-600">{data.summary.failedAudits}</div>
                <p className="text-xs text-gray-600">Failed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-600">{data.summary.pendingAudits}</div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{data.summary.totalScore}</div>
                <p className="text-xs text-gray-600">Total Score</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{data.summary.totalWeight}</div>
                <p className="text-xs text-gray-600">Max Score</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{data.summary.totalAudits}</div>
                <p className="text-xs text-gray-600">Total Audits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Audit Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topIssues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">{issue.name}</h4>
                  <p className="text-xs text-red-700 truncate">{issue.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">{issue.weight}</div>
                  <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Wins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Quick Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.quickWins.slice(0, 4).map((win) => (
              <div key={win.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">{win.name}</h4>
                  <p className="text-xs text-green-700 truncate">{win.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">{win.weight}</div>
                  <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="passed" stackId="a" fill="#16a34a" name="Passed" />
                <Bar dataKey="failed" stackId="a" fill="#dc2626" name="Failed" />
                <Bar dataKey="pending" stackId="a" fill="#6b7280" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Featured Audit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Detailed Audit Analysis (All {data.summary.totalAudits} Audits)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {allAudits.map((audit) => (
              <AccordionItem key={audit.id} value={`audit-${audit.id}`} className="border rounded-lg">
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getStatusIcon(audit.status)}
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="font-medium text-base">{audit.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{audit.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {audit.score !== null ? `${audit.score}/${audit.weight}` : 'N/A'}
                        </div>
                      </div>
                      {getStatusBadge(audit.status)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Audit Score Visualization */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Score Progress</span>
                          <span>{audit.score || 0}/{audit.weight}</span>
                        </div>
                        <Progress 
                          value={audit.score && audit.weight ? (audit.score / audit.weight) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-xl font-bold text-gray-700">
                          {audit.weight}
                        </div>
                        <div className="text-xs text-gray-500">Weight</div>
                      </div>
                    </div>

                    {/* Detailed Data */}
                    {audit.data && Object.keys(audit.data).length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Technical Details:</h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                          {Object.entries(audit.data).map(([key, value]) => {
                            // Skip complex objects and functions
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                              return null;
                            }
                            
                            return (
                              <div key={key} className="p-3 bg-white border rounded-lg">
                                <div className="font-medium text-sm text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </div>
                                <div className="mt-1 text-sm">
                                  {typeof value === 'boolean' ? (
                                    <Badge variant={value ? "default" : "destructive"} className="text-xs">
                                      {value ? 'Yes' : 'No'}
                                    </Badge>
                                  ) : Array.isArray(value) ? (
                                    <span className="text-gray-600 break-words">
                                      {value.length > 0 ? value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '') : 'None'}
                                    </span>
                                  ) : (
                                    <span className="text-gray-600 break-words">
                                      {String(value).length > 100 ? String(value).substring(0, 100) + '...' : String(value)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">💡 Recommendations:</h5>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {audit.status === false 
                          ? `This audit failed. Focus on improving ${audit.name.toLowerCase()} by following SEO best practices for this area.`
                          : audit.status === true 
                          ? `Great job! This audit passed. Continue maintaining these good SEO practices.`
                          : `This audit is pending manual review. Check the technical details above for more information.`
                        }
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* All Audits Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            Complete Audit Summary ({data.summary.totalAudits} Audits)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
            {Object.values(data.audits).map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(audit.status)}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{audit.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{audit.description}</p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="text-xs font-medium mb-1">
                    {audit.score !== null ? `${audit.score}/${audit.weight}` : 'N/A'}
                  </div>
                  {getStatusBadge(audit.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};