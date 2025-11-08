import React from 'react';
import TradingViewWidget from '@/components/ui/TradingViewWidget';
import WatchlistButton from '@/components/ui/WatchlistButton';
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from '@/lib/constants';
import { isStockInWatchlist } from '@/lib/actions/watchlist.actions';
import { searchStocks } from '@/lib/actions/finnhub.actions';

async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  // Fetch stock info to get company name
  const stocks = await searchStocks(upperSymbol);
  const stock = stocks.find((s) => s.symbol.toUpperCase() === upperSymbol);
  const companyName = stock?.name || upperSymbol;

  // Check if stock is in watchlist
  const isInWatchlist = await isStockInWatchlist(upperSymbol);

  const scriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-';

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column */}
      <section className="space-y-6">
        <TradingViewWidget
          scriptUrl={`${scriptUrl}ticker.js`}
          config={SYMBOL_INFO_WIDGET_CONFIG(upperSymbol)}
          height={170}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}advanced-chart.js`}
          config={CANDLE_CHART_WIDGET_CONFIG(upperSymbol)}
          height={600}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}mini-chart.js`}
          config={BASELINE_WIDGET_CONFIG(upperSymbol)}
          height={600}
        />
      </section>

      {/* Right Column */}
      <section className="space-y-6">
        <WatchlistButton
          symbol={upperSymbol}
          company={companyName}
          isInWatchlist={isInWatchlist}
          type="button"
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}technical-analysis.js`}
          config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upperSymbol)}
          height={400}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}symbol-overview.js`}
          config={COMPANY_PROFILE_WIDGET_CONFIG(upperSymbol)}
          height={440}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}financials.js`}
          config={COMPANY_FINANCIALS_WIDGET_CONFIG(upperSymbol)}
          height={464}
        />
      </section>
    </div>
  );
}

export default StockDetails;

