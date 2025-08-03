import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnhancedImageMigration } from '@/hooks/useEnhancedImageMigration';
import { useSEOMonitoring } from '@/hooks/useSEOMonitoring';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock
} from 'lucide-react';

interface EnhancedMigrationDashboardProps {
  isAdmin: boolean;
  products: any[];
}

export const EnhancedMigrationDashboard: React.FC<EnhancedMigrationDashboardProps> = ({
  isAdmin,
  products
}) => {
  const {
    stats,
    isMigrating,
    migrationResults,
    startEnhancedMigration,
    retryFailedImages
  } = useEnhancedImageMigration(isAdmin, products);

  const {
    metrics,
    getHealthReport
  } = useSEOMonitoring();

  const healthReport = getHealthReport();

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Migration Dashboard</h2>
          <p className="text-muted-foreground">
            Advanced image migration with 6-try retry system and SEO monitoring
          </p>
        </div>
        <Badge variant={stats.isCompleted ? "default" : "secondary"}>
          {stats.isCompleted ? "Completed" : "In Progress"}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{stats.totalImages}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Base64 Remaining</p>
                <p className="text-2xl font-bold text-orange-600">{stats.base64Images}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Migrated</p>
                <p className="text-2xl font-bold text-green-600">{stats.storageImages}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedImages}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Migration Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{stats.migrationProgress}%</span>
            </div>
            <Progress value={stats.migrationProgress} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={startEnhancedMigration}
              disabled={isMigrating || stats.isCompleted}
              className="flex items-center gap-2"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Start Enhanced Migration
                </>
              )}
            </Button>

            {stats.failedImages > 0 && (
              <Button 
                variant="outline"
                onClick={retryFailedImages}
                disabled={isMigrating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Failed ({stats.failedImages})
              </Button>
            )}
          </div>

          {stats.lastError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Last error: {stats.lastError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* SEO Health Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Health Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Health Score</p>
              <p className={`text-2xl font-bold ${
                healthReport.healthScore >= 80 ? 'text-green-600' : 
                healthReport.healthScore >= 60 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {healthReport.healthScore}/100
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Redirects</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.redirectCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Recent 404s</p>
              <p className="text-2xl font-bold text-orange-600">{healthReport.recent404s}</p>
            </div>
          </div>

          {healthReport.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {healthReport.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Results */}
      {migrationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {migrationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-mono">{result.imageId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {result.attempts} attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};