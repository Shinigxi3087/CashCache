import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Currency } from '@/interfaces/crypto';
import { Link } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch cryptocurrency data from CoinGecko
  const currencies = useQuery({
    queryKey: ['coinGeckoListings'],
    queryFn: async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-ckU5gAH4bsSBKx2eKDRJN3Ys'
        }
      };
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h',
        options
      );
      return response.json();
    },
  });

  // Filter currencies based on search query
  const filteredCurrencies = useMemo(() => {
    if (!currencies.data) return [];
    
    if (!searchQuery.trim()) return currencies.data;
    
    return currencies.data.filter((currency: any) =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currencies.data, searchQuery]);

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else if (price < 100) {
      return price.toFixed(2);
    } else {
      return price.toFixed(0);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}>
      
      <Text style={defaultStyles.sectionHeader}>Crypto Marketplace</Text>
      
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Ionicons name="search" size={20} color={Colors.gray} style={{ marginRight: 12 }} />
        <TextInput
          placeholder="Search"
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
        {currencies.isLoading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.gray }}>Loading cryptocurrencies...</Text>
          </View>
        ) : currencies.error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Error loading data</Text>
          </View>
        ) : filteredCurrencies.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.gray }}>No cryptocurrencies found</Text>
          </View>
        ) : (
          filteredCurrencies.map((currency: any, index: number) => (
            <Link href={`/crypto/${currency.id}`} key={currency.id} asChild>
              <TouchableOpacity style={{
                flexDirection: 'row',
                gap: 14,
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: index === filteredCurrencies.length - 1 ? 0 : 0.5,
                borderBottomColor: Colors.lightGray,
              }}>
                <Image 
                  source={{ uri: currency.image }} 
                  style={{ width: 40, height: 40, borderRadius: 20 }} 
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontWeight: '600', color: Colors.dark, fontSize: 16 }}>
                    {currency.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: Colors.gray, fontSize: 14, textTransform: 'uppercase' }}>
                      {currency.symbol}
                    </Text>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>
                      #{currency.market_cap_rank}
                    </Text>
                  </View>
                </View>
                <View style={{ gap: 4, alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>
                    €{formatPrice(currency.current_price)}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <Ionicons
                      name={currency.price_change_percentage_1h_in_currency > 0 ? 'caret-up' : 'caret-down'}
                      size={16}
                      color={currency.price_change_percentage_1h_in_currency > 0 ? '#00C851' : '#FF4444'}
                    />
                    <Text
                      style={{
                        color: currency.price_change_percentage_1h_in_currency > 0 ? '#00C851' : '#FF4444',
                        fontSize: 14,
                        fontWeight: '500'
                      }}>
                      {Math.abs(currency.price_change_percentage_1h_in_currency || 0).toFixed(2)}%
                    </Text>
                  </View>
                  <Text style={{ color: Colors.gray, fontSize: 12 }}>
                    MCap: €{(currency.market_cap / 1e9).toFixed(1)}B
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