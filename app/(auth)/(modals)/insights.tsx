import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useState } from 'react';

const { width: screenWidth } = Dimensions.get('window');

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');

  // Mock data for charts
  const portfolioData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12000, 13500, 11800, 15200, 18900, 22400],
        color: (opacity = 1) => `rgba(67, 56, 202, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const transactionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [450, 320, 680, 290, 520, 180, 240],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],
  };

  const assetDistribution = [
    {
      name: 'Bitcoin',
      population: 45,
      color: '#F7931A',
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
    {
      name: 'Ethereum',
      population: 25,
      color: '#627EEA',
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
    {
      name: 'Cardano',
      population: 15,
      color: '#0033AD',
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
    {
      name: 'Others',
      population: 15,
      color: Colors.gray,
      legendFontColor: Colors.dark,
      legendFontSize: 12,
    },
  ];

  const periods = ['1W', '1M', '3M', '1Y'];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(67, 56, 202, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  const StatCard = ({ title, value, change, icon, changeColor }: any) => (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <View style={styles.statIcon}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statChange}>
        <Ionicons
          name={change > 0 ? 'trending-up' : 'trending-down'}
          size={16}
          color={changeColor}
        />
        <Text style={[styles.changeText, { color: changeColor }]}>
          {Math.abs(change)}% this month
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Insights & Analytics',
          headerStyle: { backgroundColor: Colors.background },
        }} 
      />
      <ScrollView
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 100 }}>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Portfolio"
            value="€22,400"
            change={18.5}
            icon="wallet-outline"
            changeColor="#00C851"
          />
          <StatCard
            title="Monthly Profit"
            value="€3,520"
            change={12.3}
            icon="trending-up-outline"
            changeColor="#00C851"
          />
          <StatCard
            title="Active Trades"
            value="12"
            change={-5.2}
            icon="swap-horizontal-outline"
            changeColor="#FF4444"
          />
          <StatCard
            title="Success Rate"
            value="87%"
            change={8.1}
            icon="checkmark-circle-outline"
            changeColor="#00C851"
          />
        </View>

        {/* Portfolio Performance Chart */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Portfolio Performance</Text>
          <LineChart
            data={portfolioData}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Transaction Activity */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Weekly Transaction Activity</Text>
          <BarChart
            data={transactionData}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>

        {/* Asset Distribution */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Asset Distribution</Text>
          <PieChart
            data={assetDistribution}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            absolute
            style={styles.chart}
          />
        </View>

        {/* Recent Insights */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="trending-up" size={16} color="#1976D2" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Strong Performance</Text>
                <Text style={styles.insightText}>
                  Your portfolio outperformed the market by 12% this month
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="warning" size={16} color="#F57C00" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Diversification Alert</Text>
                <Text style={styles.insightText}>
                  Consider diversifying - 70% of your portfolio is in top 2 assets
                </Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Goal Achievement</Text>
                <Text style={styles.insightText}>
                  You're 75% toward your monthly investment goal of €5,000
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Top Performers This Month</Text>
          <View style={styles.performersList}>
            {[
              { name: 'Bitcoin', symbol: 'BTC', change: 15.2, value: '€45,230' },
              { name: 'Ethereum', symbol: 'ETH', change: 12.8, value: '€2,890' },
              { name: 'Cardano', symbol: 'ADA', change: 8.5, value: '€0.52' },
            ].map((asset, index) => (
              <View key={index} style={styles.performerItem}>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{asset.name}</Text>
                  <Text style={styles.performerSymbol}>{asset.symbol}</Text>
                </View>
                <View style={styles.performerStats}>
                  <Text style={styles.performerValue}>{asset.value}</Text>
                  <View style={styles.performerChange}>
                    <Ionicons name="trending-up" size={14} color="#00C851" />
                    <Text style={styles.performerChangeText}>+{asset.change}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  periodTextActive: {
    color: Colors.dark,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: (screenWidth - 44) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },
  performersList: {
    gap: 12,
  },
  performerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  performerSymbol: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  performerStats: {
    alignItems: 'flex-end',
  },
  performerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  performerChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  performerChangeText: {
    fontSize: 12,
    color: '#00C851',
    fontWeight: '500',
  },
});

export default Page;