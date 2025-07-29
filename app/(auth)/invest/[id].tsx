import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { fetchQuote, fetchCompanyProfile, fetchCandles } from '../../api/stockService';
import { TextInput } from 'react-native-gesture-handler';

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Page = () => {
  const { id } = useLocalSearchParams();
  const symbol = typeof id === 'string' ? id : id?.[0];
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  useEffect(() => {
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  // Fetch stock data
  const { data: quote } = useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => fetchQuote(symbol!),
    enabled: !!symbol,
  });

  const { data: profile } = useQuery({
    queryKey: ['stockProfile', symbol],
    queryFn: () => fetchCompanyProfile(symbol!),
    enabled: !!symbol,
  });

  const { data: candles } = useQuery({
    queryKey: ['stockCandles', symbol],
    queryFn: () => fetchCandles(symbol!),
    enabled: !!symbol,
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

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `€${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `€${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `€${(marketCap / 1e6).toFixed(2)}M`;
    return `€${marketCap.toFixed(0)}`;
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!candles) return [];
    return candles.map((candle: any) => ({
      timestamp: new Date(candle.datetime).getTime(),
      price: parseFloat(candle.close),
    }));
  }, [candles]);

  return (
    <>
      <Stack.Screen options={{ title: profile?.name || symbol || 'Stock' }} />
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
                <Text style={styles.subtitle}>{symbol}</Text>
                {profile && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Text style={{ color: Colors.gray, fontSize: 14 }}>
                      {profile.industry}
                    </Text>
                    <Text style={{ color: Colors.gray, fontSize: 14 }}>
                      {formatMarketCap(profile.marketCapitalization)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ 
                width: 60, 
                height: 60,
                borderRadius: 30,
                backgroundColor: Colors.primaryMuted,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: Colors.primary }}>
                  {symbol?.substring(0, 2)}
                </Text>
              </View>
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
                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Sell</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {chartData && chartData.length > 0 ? (
                <>
                  {!isActive && quote && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        €{quote.c.toFixed(2)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={{ fontSize: 18, color: Colors.gray }}>Today</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons
                            name={quote.dp > 0 ? 'caret-up' : 'caret-down'}
                            size={16}
                            color={quote.dp > 0 ? '#00C851' : '#FF4444'}
                          />
                          <Text
                            style={{
                              color: quote.dp > 0 ? '#00C851' : '#FF4444',
                              fontSize: 16,
                              fontWeight: '500'
                            }}>
                            {Math.abs(quote.dp).toFixed(2)}%
                          </Text>
                        </View>
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
                    data={chartData}
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
            {quote && (
              <View style={[defaultStyles.block, { marginTop: 20 }]}>
                <Text style={styles.subtitle}>Market Statistics</Text>
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>Current Price</Text>
                    <Text style={{ fontWeight: '600' }}>€{quote.c.toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>Daily Change</Text>
                    <Text style={{ 
                      fontWeight: '600',
                      color: quote.d > 0 ? '#00C851' : '#FF4444'
                    }}>
                      {quote.d > 0 ? '+' : ''}{quote.d.toFixed(2)} ({quote.dp > 0 ? '+' : ''}{quote.dp.toFixed(2)}%)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Company Info */}
            {profile && (
              <View style={[defaultStyles.block, { marginTop: 20 }]}>
                <Text style={styles.subtitle}>Company Information</Text>
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>Industry</Text>
                    <Text style={{ fontWeight: '600' }}>{profile.finnhubIndustry}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.gray }}>Market Cap</Text>
                    <Text style={{ fontWeight: '600' }}>{formatMarketCap(profile.marketCapitalization)}</Text>
                  </View>
                </View>
              </View>
            )}
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