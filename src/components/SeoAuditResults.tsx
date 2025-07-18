import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp, Shield, BarChart3 } from 'lucide-react';

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

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Top Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">{issue.name}</h4>
                  <p className="text-sm text-red-700">{issue.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Weight: {issue.weight}</div>
                  <Badge variant="destructive">Failed</Badge>
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
            {data.quickWins.slice(0, 5).map((win) => (
              <div key={win.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">{win.name}</h4>
                  <p className="text-sm text-green-700">{win.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Weight: {win.weight}</div>
                  <Badge variant="outline" className="border-green-600 text-green-600">Easy Fix</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Audit Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Detailed Audit Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(data.audits).map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(audit.status)}
                  <div>
                    <h4 className="font-medium">{audit.name}</h4>
                    <p className="text-sm text-gray-600">{audit.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {audit.score !== null ? `${audit.score}/${audit.weight}` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Weight: {audit.weight}</div>
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