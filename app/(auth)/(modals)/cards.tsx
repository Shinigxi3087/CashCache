import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { Stack } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4532',
      name: 'John Doe',
      expiry: '12/26',
      isDefault: true,
      color: '#1E3A8A',
      balance: 2450.80,
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8901',
      name: 'John Doe',
      expiry: '08/25',
      isDefault: false,
      color: '#DC2626',
      balance: 1200.45,
    },
    {
      id: 3,
      type: 'American Express',
      last4: '7834',
      name: 'John Doe',
      expiry: '03/27',
      isDefault: false,
      color: '#059669',
      balance: 850.30,
    },
  ]);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSetDefault = (cardId: number) => {
    setCards(prevCards =>
      prevCards.map(card => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const handleRemoveCard = (cardId: number) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
          },
        },
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'Visa':
        return 'card-outline';
      case 'Mastercard':
        return 'card-outline'; 
      case 'American Express':
        return 'card-outline';
      default:
        return 'card-outline';
    }
  };

  const CardComponent = ({ card }: { card: any }) => (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: card.color }]}
        onPress={animatePress}
        activeOpacity={0.9}>
        
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardType}>
            <Ionicons name={getCardIcon(card.type)} size={24} color="#fff" />
            <Text style={styles.cardTypeText}>{card.type}</Text>
          </View>
          {card.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>

        {/* Card Number */}
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
        </View>

        {/* Card Details */}
        <View style={styles.cardDetails}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>CARDHOLDER</Text>
            <Text style={styles.cardValue}>{card.name}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>EXPIRES</Text>
            <Text style={styles.cardValue}>{card.expiry}</Text>
          </View>
        </View>

        {/* Card Balance */}
        <View style={styles.cardBalance}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>€{card.balance.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      {/* Card Actions */}
      <View style={styles.cardActions}>
        {!card.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => handleSetDefault(card.id)}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
            <Text style={[styles.actionText, { color: Colors.primary }]}>Set as Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => Alert.alert('Card Details', `View details for card ending in ${card.last4}`)}>
          <Ionicons name="eye-outline" size={16} color={Colors.gray} />
          <Text style={[styles.actionText, { color: Colors.gray }]}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerAction]}
          onPress={() => handleRemoveCard(card.id)}>
          <Ionicons name="trash-outline" size={16} color="#FF4444" />
          <Text style={[styles.actionText, { color: '#FF4444' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Payment Cards',
          headerStyle: { backgroundColor: Colors.background },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => Alert.alert('Add Card', 'Add new payment card functionality')}>
              <Ionicons name="add" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 100 }}>
        
        {/* Summary Section */}
        <View style={[defaultStyles.block, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Cards Overview</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Ionicons name="card-outline" size={24} color={Colors.primary} />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryValue}>{cards.length}</Text>
                <Text style={styles.summaryLabel}>Active Cards</Text>
              </View>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Ionicons name="wallet-outline" size={24} color="#00C851" />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryValue}>€{totalBalance.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Total Balance</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cards List */}
        <Text style={[styles.sectionTitle, { marginHorizontal: 16, marginBottom: 16 }]}>
          Your Cards
        </Text>
        
        {cards.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}

        {/* Add New Card */}
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => Alert.alert('Add Card', 'Add new payment card functionality')}>
          <View style={styles.addCardContent}>
            <View style={styles.addCardIcon}>
              <Ionicons name="add" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.addCardText}>Add New Card</Text>
            <Text style={styles.addCardSubtext}>Link another payment method</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        {/* Card Security */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Security & Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Card Security</Text>
              <Text style={styles.settingSubtitle}>Manage PIN, limits, and security settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Transaction Notifications</Text>
              <Text style={styles.settingSubtitle}>Get notified about card transactions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="analytics-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Spending Analytics</Text>
              <Text style={styles.settingSubtitle}>View detailed spending patterns</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[defaultStyles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="pause-circle-outline" size={24} color="#1976D2" />
              </View>
              <Text style={styles.quickActionText}>Freeze Cards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="document-text-outline" size={24} color="#F57C00" />
              </View>
              <Text style={styles.quickActionText}>Statements</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE4EC' }]}>
                <Ionicons name="help-circle-outline" size={24} color="#C2185B" />
              </View>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardNumber: {
    marginBottom: 20,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cardBalance: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  primaryAction: {
    backgroundColor: Colors.lightGray,
  },
  secondaryAction: {
    backgroundColor: Colors.lightGray,
  },
  dangerAction: {
    backgroundColor: '#FFF5F5',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
  addCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 2,
  },
  addCardSubtext: {
    fontSize: 12,
    color: Colors.gray,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.gray,
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