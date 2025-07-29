import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { fetchStockList, fetchQuote, fetchCompanyProfile } from '../../api/stockService';

// Top 20 most popular stocks (symbols)
const POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
  'META', 'NVDA', 'JPM', 'V', 'JNJ', 
  'WMT', 'PG', 'MA', 'DIS', 'HD', 
  'BAC', 'PYPL', 'NFLX', 'ADBE', 'CRM'
];

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch stock data for popular stocks only
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ['popularStockListings'],
    queryFn: async () => {
      // First try to fetch data for all popular stocks
      const results = await Promise.all(
        POPULAR_STOCKS.map(async (symbol) => {
          try {
            const [quote, profile] = await Promise.all([
              fetchQuote(symbol),
              fetchCompanyProfile(symbol),
            ]);

            return {
              symbol,
              name: profile.name || symbol,
              price: quote.c,
              change: quote.d,
              changePercent: quote.dp,
              marketCap: profile.market_cap,
              industry: profile.industry || 'N/A',
            };
          } catch (err) {
            // If API fails for a stock, return minimal data
            return {
              symbol,
              name: symbol,
              price: 0,
              change: 0,
              changePercent: 0,
              marketCap: 0,
              industry: 'N/A',
            };
          }
        })
      );
      
      // Filter out any completely failed stocks
      return results.filter(stock => stock.price > 0);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!stocks) return [];
    
    if (!searchQuery.trim()) return stocks.slice(0, 20); // Only show top 20
    
    return stocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20); // Limit to 20 even when searching
  }, [stocks, searchQuery]);

  const formatPrice = (price?: number) => price ? `€${price.toFixed(2)}` : 'N/A';
  const formatChange = (percent?: number) =>
    percent !== undefined ? `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%` : 'N/A';

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap || marketCap === 0) return 'N/A';
    if (marketCap >= 1e12) return `€${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `€${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `€${(marketCap / 1e6).toFixed(2)}M`;
    return `€${marketCap.toFixed(0)}`;
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}>
      
      <Text style={defaultStyles.sectionHeader}>Top Stocks</Text>
      
      {/* Search Bar */}
      <View style={{
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        <Ionicons name="search" size={20} color={Colors.gray} style={{ marginRight: 12 }} />
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            fontSize: 16,
            color: Colors.dark,
          }}
          placeholderTextColor={Colors.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={defaultStyles.block}>
        {isLoading ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ textAlign: 'center', marginTop: 10, color: Colors.gray }}>
              Loading top stocks...
            </Text>
          </View>
        ) : error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.gray, marginTop: 16 }}>
              Showing cached popular stocks
            </Text>
          </View>
        ) : filteredStocks.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.gray }}>No matching stocks found</Text>
          </View>
        ) : (
          filteredStocks.map((stock, index) => (
            <Link href={`/invest/${stock.symbol}`} key={stock.symbol} asChild>
              <TouchableOpacity style={{
                flexDirection: 'row',
                gap: 14,
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: index === filteredStocks.length - 1 ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: Colors.lightGray,
              }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  backgroundColor: Colors.primaryMuted,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontWeight: 'bold', color: Colors.primary }}>
                    {stock.symbol.substring(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontWeight: '600', color: Colors.dark, fontSize: 16 }}>
                    {stock.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: Colors.gray, fontSize: 14 }}>
                      {stock.symbol}
                    </Text>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>
                      {stock.industry}
                    </Text>
                  </View>
                </View>
                <View style={{ gap: 4, alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>
                    {formatPrice(stock.price)}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <Ionicons
                      name={stock.changePercent > 0 ? 'caret-up' : 'caret-down'}
                      size={16}
                      color={stock.changePercent > 0 ? Colors.success : Colors.danger}
                    />
                    <Text style={{
                      color: stock.changePercent > 0 ? Colors.success : Colors.danger,
                      fontSize: 14,
                    }}>
                      {formatChange(stock.changePercent)}
                    </Text>
                  </View>
                  <Text style={{ color: Colors.gray, fontSize: 12 }}>
                    {formatMarketCap(stock.marketCap)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Page;