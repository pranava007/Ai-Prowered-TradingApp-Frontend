import React, { useState } from 'react';
import axios from 'axios';

const StockDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stockSymbol, setStockSymbol] = useState('RELIANCE.NS');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-30');

  const handleAnalyze = () => {
    setLoading(true);
    setData(null);
    axios
      .post('http://localhost:5000/api/analyze', {
        stock_symbol: stockSymbol,
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API fetch error:', err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10">
         Stock Analysis Dashboard
      </h1>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="Stock Symbol (e.g., RELIANCE.NS)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-indigo-500"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-indigo-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-indigo-500"
          />
          <button
            onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Loading / Message */}
      {loading && (
        <div className="text-center text-gray-600 font-medium text-lg"> Analyzing data...</div>
      )}
      {!loading && !data && (
        <div className="text-center text-gray-400">Enter stock details and click Analyze.</div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-indigo-800">
              {data.stock_symbol} ({startDate} to {endDate})
            </h2>
          </div>

          {/* Price Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              ['Start Price', data.price_summary.start_price],
              ['End Price', data.price_summary.end_price],
              ['% Gain/Loss', `${data.price_summary.gain_loss_percent}%`],
              ['High', data.price_summary.high],
              ['Low', data.price_summary.low],
              ['Volume', data.price_summary.total_volume],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition text-center"
              >
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-xl font-semibold text-gray-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Dividends and Splits */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-800"> Dividends</h3>
              <div className="bg-white rounded-lg shadow p-4 space-y-2">
                {data.events.dividends.map((d, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-gray-700 border-b pb-1 last:border-none"
                  >
                    {d.date} — ₹{d.amount}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-800"> Stock Splits</h3>
              <div className="bg-white rounded-lg shadow p-4 space-y-2">
                {data.events.splits.map((s, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-gray-700 border-b pb-1 last:border-none"
                  >
                     {s.date} — {s.split_ratio}:1
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* News Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4"> News Highlights</h3>
            <div className="space-y-4">
              {data.news.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-md shadow border-l-4 border-indigo-500 hover:shadow-md transition"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-700 font-semibold hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {/* <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{item.source}</span>
                    <span>{item.published_at}</span>
                    <span className="capitalize">{item.sentiment}</span>
                  </div> */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2 gap-2">
  
  <div className="flex justify-between items-center text-xs text-gray-600 mt-2 gap-2 flex-wrap">
  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
    </svg>
    {item.source}
  </span>
  
  <span className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
    </svg>
    {item.published_at}
  </span>
</div>

  <span
    className={`px-2 py-1 rounded-full text-white text-[11px] ${
      item.sentiment.toLowerCase() === 'positive'
        ? 'bg-green-500'
        : item.sentiment.toLowerCase() === 'negative'
        ? 'bg-red-500'
        : 'bg-gray-400'
    }`}
  >
    {item.sentiment}
  </span>
</div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
