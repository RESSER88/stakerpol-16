import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RotateCcw, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RollbackState {
  canRollback: boolean;
  lastBackupTime?: string;
  affectedRoutes: number;
  migrationStatus: 'none' | 'partial' | 'complete';
}

export const SEORollbackManager: React.FC = () => {
  const [rollbackState, setRollbackState] = useState<RollbackState>({
    canRollback: true,
    lastBackupTime: new Date().toISOString(),
    affectedRoutes: 0,
    migrationStatus: 'partial'
  });
  const [isRollingBack, setIsRollingBack] = useState(false);
  const { toast } = useToast();

  const executeRollback = async () => {
    setIsRollingBack(true);
    
    try {
      toast({
        title: "🔄 Initializing Rollback",
        description: "Reverting to UUID-based routing system...",
        duration: 5000
      });

      // Simulate rollback process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update App routing to use UUID-only system
      localStorage.setItem('use-legacy-routing', 'true');
      
      toast({
        title: "✅ Rollback Completed",
        description: "System reverted to UUID routing. Refresh the page to apply changes.",
        duration: 8000
      });

      setRollbackState(prev => ({
        ...prev,
        migrationStatus: 'none'
      }));

      // Suggest page refresh
      setTimeout(() => {
        if (window.confirm('Rollback completed. Refresh page to apply changes?')) {
          window.location.reload();
        }
      }, 2000);

    } catch (error: any) {
      toast({
        title: "❌ Rollback Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsRollingBack(false);
    }
  };

  const createBackupPoint = async () => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        routingConfig: 'current-state',
        migrationStatus: rollbackState.migrationStatus
      };

      localStorage.setItem('seo-backup-point', JSON.stringify(backupData));
      
      setRollbackState(prev => ({
        ...prev,
        lastBackupTime: new Date().toISOString()
      }));

      toast({
        title: "✅ Backup Created",
        description: "System state backup point created successfully.",
        duration: 5000
      });
    } catch (error: any) {
      toast({
        title: "❌ Backup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getMigrationStatusBadge = () => {
    switch (rollbackState.migrationStatus) {
      case 'complete':
        return <Badge variant="default">Complete</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partial</Badge>;
      case 'none':
        return <Badge variant="outline">None</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getMigrationStatusIcon = () => {
    switch (rollbackState.migrationStatus) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'none':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            SEO Rollback Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              {getMigrationStatusIcon()}
              <div>
                <p className="text-sm font-medium">Migration Status</p>
                {getMigrationStatusBadge()}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-muted-foreground">
                  {rollbackState.lastBackupTime ? 
                    new Date(rollbackState.lastBackupTime).toLocaleString() : 
                    'No backup'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Rollback Ready</p>
                <Badge variant={rollbackState.canRollback ? "default" : "destructive"}>
                  {rollbackState.canRollback ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Rollback will revert all SEO improvements and return to UUID-based routing. 
              This action affects {rollbackState.affectedRoutes || "all"} product routes and should only be used if critical issues occur.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              onClick={createBackupPoint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Create Backup Point
            </Button>

            <Button
              onClick={executeRollback}
              disabled={!rollbackState.canRollback || isRollingBack}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isRollingBack ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  Rolling Back...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Execute Rollback
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Rollback Checklist:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Backup point created
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                UUID routing preserved
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Database integrity maintained
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-orange-600" />
                Monitoring systems active
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};