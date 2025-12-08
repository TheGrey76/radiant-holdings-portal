import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, TrendingUp, TrendingDown, Bell, BellOff, Shield, Zap } from 'lucide-react';

interface Underlying {
  id: string;
  name: string;
  ticker: string;
  certificate: string;
  certificateId: string;
  barrier: number;
  strikePrice: number;
  currentPrice: number;
  lastUpdate: string;
}

interface AlertConfig {
  barrierWarningThreshold: number; // Alert when distance from barrier < X%
  autocallThreshold: number; // Alert when price > strike * X%
  enabled: boolean;
}

interface Props {
  underlyings: Underlying[];
}

const STORAGE_KEY = 'aries76_alert_config';

export const BarrierAlerts = ({ underlyings }: Props) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    barrierWarningThreshold: 15,
    autocallThreshold: 100,
    enabled: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAlertConfig(JSON.parse(saved));
    }
  }, []);

  const saveConfig = (config: AlertConfig) => {
    setAlertConfig(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  };

  const calculateDistanceFromBarrier = (current: number, strike: number, barrier: number): number => {
    if (current === 0 || strike === 0) return Infinity;
    const barrierPrice = strike * (barrier / 100);
    return ((current - barrierPrice) / barrierPrice) * 100;
  };

  const calculateDistanceFromStrike = (current: number, strike: number): number => {
    if (current === 0 || strike === 0) return 0;
    return ((current - strike) / strike) * 100;
  };

  // Underlyings approaching barrier
  const barrierAlerts = underlyings
    .filter(u => u.currentPrice > 0)
    .map(u => ({
      ...u,
      distanceFromBarrier: calculateDistanceFromBarrier(u.currentPrice, u.strikePrice, u.barrier),
    }))
    .filter(u => u.distanceFromBarrier < alertConfig.barrierWarningThreshold)
    .sort((a, b) => a.distanceFromBarrier - b.distanceFromBarrier);

  // Underlyings above strike (potential autocall)
  const autocallCandidates = underlyings
    .filter(u => u.currentPrice > 0)
    .map(u => ({
      ...u,
      distanceFromStrike: calculateDistanceFromStrike(u.currentPrice, u.strikePrice),
    }))
    .filter(u => u.distanceFromStrike >= alertConfig.autocallThreshold - 100)
    .sort((a, b) => b.distanceFromStrike - a.distanceFromStrike);

  // Group by certificate for autocall analysis
  const certificateAutocallStatus = [...new Set(underlyings.map(u => u.certificateId))].map(certId => {
    const certUnderlyings = underlyings.filter(u => u.certificateId === certId && u.currentPrice > 0);
    if (certUnderlyings.length === 0) return null;

    const allAboveStrike = certUnderlyings.every(u => u.currentPrice >= u.strikePrice);
    const worstPerformer = certUnderlyings.reduce((worst, current) => {
      const worstDist = calculateDistanceFromStrike(worst.currentPrice, worst.strikePrice);
      const currentDist = calculateDistanceFromStrike(current.currentPrice, current.strikePrice);
      return currentDist < worstDist ? current : worst;
    });

    return {
      certificateId: certId,
      certificateName: certUnderlyings[0].certificate,
      allAboveStrike,
      worstPerformer,
      worstPerformerDistance: calculateDistanceFromStrike(worstPerformer.currentPrice, worstPerformer.strikePrice),
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Alert Configuration */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Configurazione Alert
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={alertConfig.enabled}
                onCheckedChange={(checked) => saveConfig({ ...alertConfig, enabled: checked })}
              />
              <Label>{alertConfig.enabled ? 'Attivi' : 'Disattivati'}</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Soglia Alert Barriera</Label>
              <Badge variant="outline">{alertConfig.barrierWarningThreshold}%</Badge>
            </div>
            <Slider
              value={[alertConfig.barrierWarningThreshold]}
              onValueChange={([value]) => saveConfig({ ...alertConfig, barrierWarningThreshold: value })}
              min={5}
              max={30}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-slate-500">Alert quando il prezzo è entro il {alertConfig.barrierWarningThreshold}% dalla barriera</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Soglia Autocall</Label>
              <Badge variant="outline">{alertConfig.autocallThreshold}% dello strike</Badge>
            </div>
            <Slider
              value={[alertConfig.autocallThreshold]}
              onValueChange={([value]) => saveConfig({ ...alertConfig, autocallThreshold: value })}
              min={95}
              max={110}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-slate-500">Evidenzia sottostanti sopra il {alertConfig.autocallThreshold}% dello strike</p>
          </div>
        </CardContent>
      </Card>

      {/* Barrier Warnings */}
      <Card className={barrierAlerts.length > 0 ? 'border-red-200 bg-red-50/50' : ''}>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className={`h-5 w-5 ${barrierAlerts.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            Alert Barriera
            {barrierAlerts.length > 0 && (
              <Badge className="bg-red-500 text-white">{barrierAlerts.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barrierAlerts.length > 0 ? (
            <div className="space-y-2">
              {barrierAlerts.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.certificate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Prezzo: <span className="font-mono">€{u.currentPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-sm">
                      Barriera: <span className="font-mono">€{(u.strikePrice * u.barrier / 100).toFixed(2)}</span>
                    </p>
                    <Badge className={u.distanceFromBarrier < 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-100 text-amber-800'}>
                      {u.distanceFromBarrier.toFixed(1)}% dalla barriera
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-500">
              <Shield className="h-5 w-5 text-emerald-600" />
              <p>Nessun sottostante in prossimità della barriera</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autocall Candidates */}
      <Card className={autocallCandidates.some(u => u.distanceFromStrike >= 0) ? 'border-emerald-200 bg-emerald-50/50' : ''}>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className={`h-5 w-5 ${autocallCandidates.some(u => u.distanceFromStrike >= 0) ? 'text-emerald-600' : 'text-slate-400'}`} />
            Candidati Autocall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            Sottostanti sopra lo strike price — condizione necessaria per l'autocall
          </p>
          <div className="space-y-3">
            {certificateAutocallStatus.map(cert => cert && (
              <div key={cert.certificateId} className="p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{cert.certificateName}</p>
                    <p className="text-xs text-slate-500 font-mono">{cert.certificateId}</p>
                  </div>
                  {cert.allAboveStrike ? (
                    <Badge className="bg-emerald-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Autocall Possibile
                    </Badge>
                  ) : (
                    <Badge variant="outline">Non Autocallable</Badge>
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-slate-600">
                    Worst performer: <span className="font-semibold">{cert.worstPerformer.name}</span>
                  </p>
                  <p className={`font-semibold ${cert.worstPerformerDistance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {cert.worstPerformerDistance >= 0 ? '+' : ''}{cert.worstPerformerDistance.toFixed(1)}% vs strike
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Underlyings Above Strike */}
      {autocallCandidates.filter(u => u.distanceFromStrike >= 0).length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Sottostanti Sopra Strike
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {autocallCandidates
                .filter(u => u.distanceFromStrike >= 0)
                .map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.certificate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        Prezzo: <span className="font-mono font-semibold">€{u.currentPrice.toFixed(2)}</span>
                      </p>
                      <p className="text-sm">
                        Strike: <span className="font-mono">€{u.strikePrice.toFixed(2)}</span>
                      </p>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        +{u.distanceFromStrike.toFixed(1)}% sopra strike
                      </Badge>
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
