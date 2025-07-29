import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const { width: screenWidth } = Dimensions.get('window');

const periods = ['This Month', 'Last Month', 'Last 3 Months', 'This Year'];

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  // Mock data for spending categories
  const spendingCategories = [
    {
      id: 1,
      name: 'Dining & Food',
      icon: 'restaurant-outline',
      spent: 485.30,
      budget: 600,
      color: '#FF6B6B',
      transactions: 23,
      lastTransaction: 'Starbucks Coffee',
    },
    {
      id: 2,
      name: 'Entertainment',
      icon: 'game-controller-outline',
      spent: 125.50,
      budget: 200,
      color: '#4ECDC4',
      transactions: 8,
      lastTransaction: 'Netflix Subscription',
    },
    {
      id: 3,
      name: 'Shopping',
      icon: 'bag-outline',
      spent: 320.80,
      budget: 400,
      color: '#45B7D1',
      transactions: 12,
      lastTransaction: 'Amazon Purchase',
    },
    {
      id: 4,
      name: 'Transportation',
      icon: 'car-outline',
      spent: 89.20,
      budget: 150,
      color: '#F9CA24',
      transactions: 15,
      lastTransaction: 'Uber Ride',
    },
    {
      id: 5,
      name: 'Health & Fitness',
      icon: 'fitness-outline',
      spent: 75.00,
      budget: 100,
      color: '#00D2D3',
      transactions: 5,
      lastTransaction: 'Gym Membership',
    },
    {
      id: 6,
      name: 'Travel',
      icon: 'airplane-outline',
      spent: 0,
      budget: 500,
      color: '#FF9FF3',
      transactions: 0,
      lastTransaction: 'No recent activity',
    },
  ];

  // Goals data
  const goals = [
    {
      id: 1,
      title: 'Summer Vacation',
      target: 2500,
      current: 1650,
      icon: 'sunny-outline',
      color: '#FF6B6B',
      deadline: '3 months',
      category: 'Travel',
    },
    {
      id: 2,
      title: 'New Laptop',
      target: 1200,
      current: 850,
      icon: 'laptop-outline',
      color: '#4ECDC4',
      deadline: '2 months',
      category: 'Technology',
    },
    {
      id: 3,
      title: 'Emergency Fund',
      target: 3000,
      current: 2100,
      icon: 'shield-checkmark-outline',
      color: '#45B7D1',
      deadline: '6 months',
      category: 'Savings',
    },
  ];

  const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = spendingCategories.reduce((sum, cat) => sum + cat.budget, 0);

  const CategoryCard = ({ category }: { category: any }) => {
    const progress = (category.spent / category.budget) * 100;
    const isOverBudget = progress > 100;

    return (
      <TouchableOpacity style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
            <Ionicons name={category.icon} size={24} color={category.color} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryTransactions}>{category.transactions} transactions</Text>
          </View>
          <View style={styles.categoryAmount}>
            <Text style={styles.categorySpent}>€{category.spent.toFixed(2)}</Text>
            <Text style={styles.categoryBudget}>of €{category.budget}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(progress, 100)}%`, 
                  backgroundColor: isOverBudget ? '#FF4444' : category.color 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: isOverBudget ? '#FF4444' : Colors.gray }]}>
            {progress.toFixed(0)}%
          </Text>
        </View>
        
        <Text style={styles.lastTransaction}>Last: {category.lastTransaction}</Text>
      </TouchableOpacity>
    );
  };

  const GoalCard = ({ goal }: { goal: any }) => {
    const progress = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;

    return (
      <TouchableOpacity style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
            <Ionicons name={goal.icon} size={20} color={goal.color} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>{goal.deadline} left</Text>
          </View>
          <Text style={styles.goalProgress}>{progress.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBar}>
            <View 
              style={[
                styles.goalProgressFill, 
                { width: `${progress}%`, backgroundColor: goal.color }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.goalCurrent}>€{goal.current.toFixed(2)}</Text>
          <Text style={styles.goalRemaining}>€{remaining.toFixed(2)} to go</Text>
          <Text style={styles.goalTarget}>of €{goal.target}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 100 }}>
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Your Lifestyle</Text>
        <Text style={styles.headerSubtitle}>Track spending that matters to you</Text>
      </View>

      {/* Period Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.periodContainer}
        contentContainerStyle={{ paddingHorizontal: 16 }}>
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
      </ScrollView>

      {/* Spending Overview */}
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <View style={styles.overviewHeader}>
          <View>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <Text style={styles.overviewAmount}>€{totalSpent.toFixed(2)}</Text>
            <Text style={styles.overviewBudget}>of €{totalBudget} budget</Text>
          </View>
          <View style={styles.overviewStats}>
            <Text style={styles.overviewLabel}>Budget Health</Text>
            <View style={styles.budgetHealth}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color="#00C851" 
              />
              <Text style={styles.budgetHealthText}>On Track</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Spending Distribution Chart */}
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Spending Distribution</Text>
        
        <View style={styles.customPieChart}>
          <View style={styles.pieChartCenter}>
            <Text style={styles.pieChartTotal}>€{totalSpent.toFixed(0)}</Text>
            <Text style={styles.pieChartLabel}>Total Spent</Text>
          </View>
          
          <View style={styles.pieChartLegend}>
            {spendingCategories.map((category, index) => {
              const percentage = ((category.spent / totalSpent) * 100).toFixed(1);
              return (
                <View key={category.id} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendName}>{category.name.split(' ')[0]}</Text>
                    <Text style={styles.legendValue}>€{category.spent.toFixed(0)} ({percentage}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Spending Categories */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { marginHorizontal: 16, marginBottom: 16 }]}>
          Spending Categories
        </Text>
        {spendingCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </View>

      {/* Financial Goals */}
      <View style={styles.goalsSection}>
        <View style={styles.goalsSectionHeader}>
          <Text style={[styles.sectionTitle, { marginHorizontal: 16 }]}>
            Your Goals
          </Text>
          <TouchableOpacity style={styles.addGoalButton}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.addGoalText}>Add Goal</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </ScrollView>
      </View>

      {/* Lifestyle Insights */}
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Lifestyle Insights</Text>
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={[styles.insightIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="trending-up" size={20} color="#1976D2" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Spending Pattern</Text>
              <Text style={styles.insightText}>
                You spend 40% more on weekends, especially on dining and entertainment.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={[styles.insightIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="bulb" size={20} color="#F57C00" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Smart Tip</Text>
              <Text style={styles.insightText}>
                Cook 2 more meals at home this week to stay under your dining budget.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={[styles.insightIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="trophy" size={20} color="#2E7D32" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Achievement</Text>
              <Text style={styles.insightText}>
                Great job! You're 15% under budget in transportation this month.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[defaultStyles.block, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="add-circle-outline" size={24} color="#1976D2" />
            </View>
            <Text style={styles.quickActionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="calendar-outline" size={24} color="#F57C00" />
            </View>
            <Text style={styles.quickActionText}>Plan Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="analytics-outline" size={24} color="#2E7D32" />
            </View>
            <Text style={styles.quickActionText}>View Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FCE4EC' }]}>
              <Ionicons name="notifications-outline" size={24} color="#C2185B" />
            </View>
            <Text style={styles.quickActionText}>Set Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.gray,
  },
  periodContainer: {
    marginBottom: 10,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 8,
  },
  overviewBudget: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  overviewStats: {
    alignItems: 'flex-end',
  },
  overviewLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  budgetHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetHealthText: {
    fontSize: 14,
    color: '#00C851',
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  customPieChart: {
    padding: 20,
  },
  pieChartCenter: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
  },
  pieChartTotal: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  pieChartLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  pieChartLegend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  legendValue: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  categoriesSection: {
    marginTop: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  categoryTransactions: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categorySpent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  categoryBudget: {
    fontSize: 12,
    color: Colors.gray,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  lastTransaction: {
    fontSize: 11,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  goalsSection: {
    marginTop: 20,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  addGoalText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  goalCard: {
    backgroundColor: '#fff',
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  goalDeadline: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  goalProgressContainer: {
    marginBottom: 12,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  goalRemaining: {
    fontSize: 12,
    color: Colors.gray,
  },
  goalTarget: {
    fontSize: 12,
    color: Colors.gray,
  },
  insightCard: {
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'center',
  },
});

export default Page;