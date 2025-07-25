import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
const categories = ['Overview', 'News', 'Orders', 'Transactions'];
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Page = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  useEffect(() => {
    console.log(isActive);
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  // Fetch detailed coin information from CoinGecko
  const { data: coinData } = useQuery({
    queryKey: ['coinGeckoDetail', id],
    queryFn: async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-ckU5gAH4bsSBKx2eKDRJN3Ys'
        }
      };
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        options
      );
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch market data
  const { data: marketData } = useQuery({
    queryKey: ['coinGeckoMarket', id],
    queryFn: async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-ckU5gAH4bsSBKx2eKDRJN3Ys'
        }
      };
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
        options
      );
      const data = await response.json();
      return data[0];
    },
    enabled: !!id,
  });

  // Fetch historical price data for chart
  const { data: tickers } = useQuery({
    queryKey: ['coinGeckoHistory', id],
    queryFn: async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-ckU5gAH4bsSBKx2eKDRJN3Ys'
        }
      };
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=eur&days=30&interval=daily`,
        options
      );
      const data = await response.json();
      
      // Transform data for the chart
      return data.prices?.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
      })) || [];
    },
    enabled: !!id,
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)} €`,
      defaultValue: '',
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: '',
    };
  });

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

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `€${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `€${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `€${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `€${marketCap.toFixed(0)}`;
    }
  };

  // Clean HTML tags from description
  const cleanDescription = (html: string) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  return (
    <>
      <Stack.Screen options={{ title: coinData?.name || 'Loading...' }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(i) => i.title}
        sections={[{ data: [{ title: 'Chart' }] }]}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}>
                <Text
                  style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 16,
              }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subtitle}>{coinData?.symbol?.toUpperCase()}</Text>
                {marketData && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Text style={{ color: Colors.gray, fontSize: 14 }}>
                      Rank #{marketData.market_cap_rank}
                    </Text>
                    <Text style={{ color: Colors.gray, fontSize: 14 }}>
                      {formatMarketCap(marketData.market_cap)}
                    </Text>
                  </View>
                )}
              </View>
              <Image 
                source={{ uri: coinData?.image?.large || coinData?.image?.small }} 
                style={{ width: 60, height: 60 }} 
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primary, flexDirection: 'row', gap: 16 },
                ]}>
                <Ionicons name="add" size={24} color={'#fff'} />
                <Text style={[defaultStyles.buttonText, { color: '#fff' }]}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primaryMuted, flexDirection: 'row', gap: 16 },
                ]}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Receive</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {tickers && tickers.length > 0 ? (
                <>
                  {!isActive && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        €{formatPrice(marketData?.current_price || tickers[tickers.length - 1]?.price || 0)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={{ fontSize: 18, color: Colors.gray }}>Today</Text>
                        {marketData?.price_change_percentage_24h && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons
                              name={marketData.price_change_percentage_24h > 0 ? 'caret-up' : 'caret-down'}
                              size={16}
                              color={marketData.price_change_percentage_24h > 0 ? '#00C851' : '#FF4444'}
                            />
                            <Text
                              style={{
                                color: marketData.price_change_percentage_24h > 0 ? '#00C851' : '#FF4444',
                                fontSize: 16,
                                fontWeight: '500'
                              }}>
                              {Math.abs(marketData.price_change_percentage_24h).toFixed(2)}%
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}
                        animatedProps={animatedText}></AnimatedTextInput>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={{ fontSize: 18, color: Colors.gray }}
                        animatedProps={animatedDateText}></AnimatedTextInput>
                    </View>
                  )}
                  <CartesianChart
                    chartPressState={state}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `€${v.toFixed(0)}`,
                      formatXLabel: (ms) => format(new Date(ms), 'MM/dd'),
                    }}
                    data={tickers}
                    xKey="timestamp"
                    yKeys={['price']}>
                    {({ points }) => (
                      <>
                        <Line points={points.price} color={Colors.primary} strokeWidth={3} />
                        {isActive && <ToolTip x={state.x.position} y={state.y.price.position} />}
                      </>
                    )}
                  </CartesianChart>
                </>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: Colors.gray }}>Loading chart data...</Text>
                </View>
              )}
            </View>

            {/* Market Stats */}
            {marketData && (
              <View style={[defaultStyles.block, { marginTop: 20 }]}>
                <Text style={styles.subtitle}>Market Statistics</Text>
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>Market Cap</Text>
                    <Text style={{ fontWeight: '600' }}>{formatMarketCap(marketData.market_cap)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>24h Volume</Text>
                    <Text style={{ fontWeight: '600' }}>{formatMarketCap(marketData.total_volume)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>24h High</Text>
                    <Text style={{ fontWeight: '600' }}>€{formatPrice(marketData.high_24h)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>24h Low</Text>
                    <Text style={{ fontWeight: '600' }}>€{formatPrice(marketData.low_24h)}</Text>
                  </View>
                  {marketData.circulating_supply && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: Colors.gray }}>Circulating Supply</Text>
                      <Text style={{ fontWeight: '600' }}>
                        {(marketData.circulating_supply / 1e6).toFixed(2)}M {coinData?.symbol?.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Overview with real description */}
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              {coinData?.description?.en ? (
                <Text style={{ color: Colors.gray, lineHeight: 22 }}>
                  {cleanDescription(coinData.description.en)}
                </Text>
              ) : (
                <Text style={{ color: Colors.gray, lineHeight: 22 }}>
                  Loading description...
                </Text>
              )}
              
              {/* Additional Info */}
              {coinData && (
                <View style={{ marginTop: 16, gap: 8 }}>
                  {coinData.categories && coinData.categories.length > 0 && (
                    <View>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Categories:</Text>
                      <Text style={{ color: Colors.gray }}>
                        {coinData.categories.slice(0, 3).join(', ')}
                      </Text>
                    </View>
                  )}
                  
                  {coinData.genesis_date && (
                    <View>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Launch Date:</Text>
                      <Text style={{ color: Colors.gray }}>
                        {new Date(coinData.genesis_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  
                  {coinData.hashing_algorithm && (
                    <View>
                      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Algorithm:</Text>
                      <Text style={{ color: Colors.gray }}>{coinData.hashing_algorithm}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </>
        )}></SectionList>
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#000',
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});

export default Page;