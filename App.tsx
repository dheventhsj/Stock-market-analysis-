import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StockCard } from './components/StockCard';
import { PredictionChart } from './components/PredictionChart';
import { MarketOverview } from './components/MarketOverview';
import { Watchlist } from './components/Watchlist';
import { SearchBar } from './components/SearchBar';
import { stockData } from './data/stockData';
import { StockData } from './types/stock';

function App() {
  const [selectedStock, setSelectedStock] = useState<StockData>(stockData[0]);
  const [watchlist, setWatchlist] = useState<StockData[]>([stockData[0], stockData[1], stockData[2]]);
  const [searchResults, setSearchResults] = useState<StockData[]>([]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setSelectedStock(prev => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() - 0.5) * 2,
        change: prev.change + (Math.random() - 0.5) * 0.5,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock);
  };

  const handleSearch = (query: string) => {
    if (query.length > 0) {
      const results = stockData.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addToWatchlist = (stock: StockData) => {
    if (!watchlist.find(item => item.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Search and Watchlist */}
          <div className="lg:col-span-1 space-y-6">
            <SearchBar 
              onSearch={handleSearch} 
              results={searchResults}
              onSelectStock={handleStockSelect}
            />
            <Watchlist 
              stocks={watchlist} 
              onSelectStock={handleStockSelect}
              selectedSymbol={selectedStock.symbol}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <MarketOverview />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <StockCard stock={selectedStock} onAddToWatchlist={addToWatchlist} />
              </div>
              <div className="xl:col-span-1">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Prediction Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">24h Prediction</span>
                      <span className="text-green-400 font-semibold">
                        ${(selectedStock.currentPrice * 1.023).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">7d Prediction</span>
                      <span className="text-green-400 font-semibold">
                        ${(selectedStock.currentPrice * 1.087).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Confidence</span>
                      <span className="text-yellow-400 font-semibold">78.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Risk Level</span>
                      <span className="text-orange-400 font-semibold">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PredictionChart stock={selectedStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;