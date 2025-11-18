'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleMetrics {
  isGreen: boolean;
  isRed: boolean;
  upperWick: number;
  lowerWick: number;
  body: number;
  priceRange: number;
  bodyPercent: number;
  upperWickPercent: number;
  lowerWickPercent: number;
  wickDiff: number;
  wickDiffPercent: number;
  candleColor: string;
}

interface DojiResult {
  isDoji: boolean;
  dojiType?: string;
  signal?: string;
  description?: string;
  criteria: {
    wickSimilarity: boolean;
    upperWickMin: boolean;
    lowerWickMin: boolean;
    smallBody: boolean;
  };
}

const WICK_DIFF_THRESHOLD = 30;
const MIN_WICK_PERCENT = 1;
const MAX_BODY_PERCENT = 30;

export default function DojiIdentifier() {
  const [candleData, setCandleData] = useState<CandleData>({
    open: 0,
    high: 0,
    low: 0,
    close: 0
  });
  
  const [inputData, setInputData] = useState<CandleData>({
    open: 0,
    high: 0,
    low: 0,
    close: 0
  });
  
  const [metrics, setMetrics] = useState<CandleMetrics | null>(null);
  const [result, setResult] = useState<DojiResult | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const calculateMetrics = (data: CandleData): CandleMetrics => {
    const { open, high, low, close } = data;
    
    const isGreen = close > open;
    const isRed = close < open;
    
    let upperWick: number;
    let lowerWick: number;
    let candleColor: string;
    
    if (isGreen) {
      upperWick = high - close;
      lowerWick = open - low;
      candleColor = 'GREEN 🟢';
    } else {
      upperWick = high - open;
      lowerWick = close - low;
      candleColor = isRed ? 'RED 🔴' : 'NEUTRAL ⚪';
    }
    
    const body = Math.abs(close - open);
    const priceRange = high - low;
    
    const bodyPercent = priceRange > 0 ? (body / priceRange) * 100 : 0;
    const upperWickPercent = close > 0 ? (upperWick / close) * 100 : 0;
    const lowerWickPercent = close > 0 ? (lowerWick / close) * 100 : 0;
    
    const avgWick = (upperWick + lowerWick) / 2;
    const wickDiff = Math.abs(upperWick - lowerWick);
    const wickDiffPercent = avgWick > 0 ? (wickDiff / avgWick) * 100 : 0;
    
    return {
      isGreen,
      isRed,
      upperWick,
      lowerWick,
      body,
      priceRange,
      bodyPercent,
      upperWickPercent,
      lowerWickPercent,
      wickDiff,
      wickDiffPercent,
      candleColor
    };
  };

  const analyzeDoji = (metrics: CandleMetrics): DojiResult => {
    const {
      wickDiffPercent,
      upperWickPercent,
      lowerWickPercent,
      bodyPercent,
      upperWick,
      lowerWick,
      body
    } = metrics;
    
    const criteria = {
      wickSimilarity: wickDiffPercent <= WICK_DIFF_THRESHOLD,
      upperWickMin: upperWickPercent >= MIN_WICK_PERCENT,
      lowerWickMin: lowerWickPercent >= MIN_WICK_PERCENT,
      smallBody: bodyPercent < MAX_BODY_PERCENT
    };
    
    const isDoji = criteria.wickSimilarity && 
                   criteria.upperWickMin && 
                   criteria.lowerWickMin && 
                   criteria.smallBody;
    
    if (!isDoji) {
      return { isDoji: false, criteria };
    }
    
    let dojiType: string;
    let signal: string;
    let description: string;
    
    if (upperWick > body * 2 && lowerWick < body) {
      dojiType = 'DRAGONFLY DOJI 🐉';
      signal = 'BULLISH REVERSAL 📈';
      description = 'Long lower wick, short upper wick - buyers pushing back';
    } else if (lowerWick > body * 2 && upperWick < body) {
      dojiType = 'GRAVESTONE DOJI 🪦';
      signal = 'BEARISH REVERSAL 📉';
      description = 'Long upper wick, short lower wick - sellers pushing back';
    } else if (upperWick > body * 2 && lowerWick > body * 2) {
      dojiType = 'LONG-LEGGED DOJI 🦵';
      signal = 'HIGH VOLATILITY ⚡';
      description = 'Long wicks on both sides - extreme indecision';
    } else {
      dojiType = 'STANDARD DOJI ⭐';
      signal = 'INDECISION 🤔';
      description = 'Balanced wicks - market uncertainty';
    }
    
    return {
      isDoji: true,
      dojiType,
      signal,
      description,
      criteria
    };
  };

  const handleInputChange = (field: keyof CandleData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleAnalyze = () => {
    if (inputData.open <= 0 || inputData.high <= 0 || inputData.low <= 0 || inputData.close <= 0) {
      alert('Please enter valid positive numbers for all price fields');
      return;
    }
    
    if (inputData.high < inputData.open || inputData.high < inputData.close ||
        inputData.low > inputData.open || inputData.low > inputData.close) {
      alert('Invalid price relationships: High must be >= Open/Close, Low must be <= Open/Close');
      return;
    }
    
    setCandleData(inputData);
    const calculatedMetrics = calculateMetrics(inputData);
    setMetrics(calculatedMetrics);
    const analysisResult = analyzeDoji(calculatedMetrics);
    setResult(analysisResult);
    setAnalyzed(true);
  };

  const handleReset = () => {
    setInputData({ open: 0, high: 0, low: 0, close: 0 });
    setCandleData({ open: 0, high: 0, low: 0, close: 0 });
    setMetrics(null);
    setResult(null);
    setAnalyzed(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">🎯 DOJI IDENTIFIER</h1>
          <p className="text-muted-foreground">Analyze candlestick patterns for Doji formations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter OHLC Prices</CardTitle>
            <CardDescription>Provide the Open, High, Low, and Close prices for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="open" className="text-sm font-medium">Open Price</label>
                <Input
                  id="open"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={inputData.open || ''}
                  onChange={(e) => handleInputChange('open', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="high" className="text-sm font-medium">High Price</label>
                <Input
                  id="high"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={inputData.high || ''}
                  onChange={(e) => handleInputChange('high', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="low" className="text-sm font-medium">Low Price</label>
                <Input
                  id="low"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={inputData.low || ''}
                  onChange={(e) => handleInputChange('low', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="close" className="text-sm font-medium">Close Price</label>
                <Input
                  id="close"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={inputData.close || ''}
                  onChange={(e) => handleInputChange('close', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAnalyze} className="flex-1">
                Analyze Candle
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {analyzed && metrics && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Your Candle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Open</p>
                    <p className="text-lg font-semibold">{candleData.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High</p>
                    <p className="text-lg font-semibold">{candleData.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low</p>
                    <p className="text-lg font-semibold">{candleData.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Close</p>
                    <p className="text-lg font-semibold">{candleData.close.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant={metrics.isGreen ? 'default' : metrics.isRed ? 'destructive' : 'secondary'}>
                    {metrics.candleColor}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📏 Candle Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>Upper Wick:</span>
                    <span className="font-mono">{metrics.upperWick.toFixed(2)} ({metrics.upperWickPercent.toFixed(2)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lower Wick:</span>
                    <span className="font-mono">{metrics.lowerWick.toFixed(2)} ({metrics.lowerWickPercent.toFixed(2)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Body:</span>
                    <span className="font-mono">{metrics.body.toFixed(2)} ({metrics.bodyPercent.toFixed(2)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wick Difference:</span>
                    <span className="font-mono">{metrics.wickDiff.toFixed(2)} ({metrics.wickDiffPercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔍 Doji Criteria Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Wick similarity ({metrics.wickDiffPercent.toFixed(1)}% ≤ {WICK_DIFF_THRESHOLD}%):</span>
                    {result?.criteria.wickSimilarity ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upper wick &gt; {MIN_WICK_PERCENT}% ({metrics.upperWickPercent.toFixed(1)}%):</span>
                    {result?.criteria.upperWickMin ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lower wick &gt; {MIN_WICK_PERCENT}% ({metrics.lowerWickPercent.toFixed(1)}%):</span>
                    {result?.criteria.lowerWickMin ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Small body &lt; {MAX_BODY_PERCENT}% ({metrics.bodyPercent.toFixed(1)}%):</span>
                    {result?.criteria.smallBody ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={result?.isDoji ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result?.isDoji ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <span>🎯 RESULT: THIS IS A DOJI CANDLE!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <span>❌ RESULT: NOT A DOJI CANDLE</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result?.isDoji ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-lg font-semibold">{result.dojiType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Signal</p>
                        <p className="text-lg font-semibold">{result.signal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Meaning</p>
                        <p className="text-sm">{result.description}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm">⚠️ WARNING: This candle pattern may indicate trend reversal!</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">This is a regular candle pattern.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
