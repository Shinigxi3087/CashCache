// app/api/stockService.ts
import axios from 'axios';

const API_KEY = '770b1a32361c4244ab37e879b88484eb'; 
const BASE_URL = 'https://api.twelvedata.com';

// Rate limiting variables
let lastApiCallTime = 0;
const FREE_TIER_DELAY = 8000; // 8 seconds between calls (free tier allows 8 requests/minute)

// TypeScript interfaces
interface StockQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
}

interface CompanyProfile {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  country: string;
  type: string;
  market_cap?: number;
  sector?: string;
  industry?: string;
}

interface CandleData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

interface StockListing {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  country: string;
  type: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Enforces rate limiting for free tier
 */
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  
  if (timeSinceLastCall < FREE_TIER_DELAY) {
    const delay = FREE_TIER_DELAY - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastApiCallTime = Date.now();
};

/**
 * Fetches a list of stocks (limited to 8 results in free tier)
 */
export const fetchStockList = async (): Promise<StockListing[]> => {
  try {
    await enforceRateLimit();
    
    const res = await api.get('/stocks', {
      params: {
        exchange: 'NASDAQ',
        country: 'United States',
        limit: 8 // Free tier limitation
      },
    });

    if (!res.data.data || res.data.status === 'error') {
      throw new Error(res.data.message || 'No data returned from API');
    }

    return res.data.data.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      currency: stock.currency,
      country: stock.country,
      type: stock.type
    }));
  } catch (error) {
    console.error('Error fetching stock list:', error);
    throw new Error('Failed to fetch stock list. Free tier may be rate limited.');
  }
};

/**
 * Fetches quote data for a specific stock symbol
 */
export const fetchQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    await enforceRateLimit();
    
    const res = await api.get('/quote', {
      params: { symbol }
    });

    if (res.data.status === 'error') {
      throw new Error(res.data.message || 'Error fetching quote');
    }

    return {
      c: parseFloat(res.data.close) || 0,
      d: parseFloat(res.data.change) || 0,
      dp: parseFloat(res.data.percent_change) || 0,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw new Error(`Failed to fetch quote. Free tier may not support real-time quotes for ${symbol}`);
  }
};

/**
 * Fetches company profile data (limited in free tier)
 */
export const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  try {
    await enforceRateLimit();
    
    const res = await api.get('/profile', {
      params: { symbol }
    });

    if (res.data.status === 'error') {
      // Fallback to minimal data if profile endpoint fails
      return {
        symbol,
        name: symbol,
        exchange: 'N/A',
        currency: 'USD',
        country: 'N/A',
        type: 'N/A'
      };
    }

    return {
      symbol: res.data.symbol || symbol,
      name: res.data.name || symbol,
      exchange: res.data.exchange || 'N/A',
      currency: res.data.currency || 'USD',
      country: res.data.country || 'N/A',
      type: res.data.type || 'N/A',
      market_cap: res.data.market_cap ? parseFloat(res.data.market_cap) : undefined,
      sector: res.data.sector || undefined,
      industry: res.data.industry || undefined
    };
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    // Return minimal profile data if API fails
    return {
      symbol,
      name: symbol,
      exchange: 'N/A',
      currency: 'USD',
      country: 'N/A',
      type: 'N/A'
    };
  }
};

/**
 * Fetches historical candle data (limited in free tier)
 */
export const fetchCandles = async (
  symbol: string,
  interval: string = '1day',
  outputsize: number = 30
): Promise<CandleData[]> => {
  try {
    await enforceRateLimit();
    
    const res = await api.get('/time_series', {
      params: {
        symbol,
        interval,
        outputsize: Math.min(outputsize, 30), // Free tier max
      },
    });

    if (!res.data || !res.data.values || res.data.status === 'error') {
      throw new Error(res.data?.message || 'Error fetching candles');
    }

    return res.data.values.map((item: any) => ({
      datetime: item.datetime,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    })).reverse(); // Latest first
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    
    // Generate mock data if API fails
    const mockData: CandleData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        datetime: date.toISOString().split('T')[0],
        open: (100 + Math.random() * 10).toFixed(2),
        high: (105 + Math.random() * 5).toFixed(2),
        low: (95 - Math.random() * 5).toFixed(2),
        close: (100 + Math.random() * 10).toFixed(2)
      });
    }
    
    return mockData;
  }
};

/**
 * Fetches all data for a stock with single API call (more efficient for free tier)
 */
export const fetchStockOverview = async (symbol: string) => {
  try {
    await enforceRateLimit();
    
    const res = await api.get('/time_series', {
      params: {
        symbol,
        interval: '1day',
        outputsize: 30,
        dp: 4, // decimal places
      },
    });

    if (!res.data.values || res.data.status === 'error') {
      throw new Error(res.data?.message || 'Error fetching overview');
    }

    const values = res.data.values;
    const latest = values[0];
    const previous = values[1];
    
    const change = parseFloat(latest.close) - parseFloat(previous.close);
    const changePercent = (change / parseFloat(previous.close)) * 100;

    return {
      quote: {
        c: parseFloat(latest.close),
        d: change,
        dp: changePercent
      },
      candles: values.map((item: any) => ({
        datetime: item.datetime,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
      })).reverse()
    };
  } catch (error) {
    console.error(`Error fetching overview for ${symbol}:`, error);
    throw new Error(`Failed to fetch overview for ${symbol}`);
  }
};