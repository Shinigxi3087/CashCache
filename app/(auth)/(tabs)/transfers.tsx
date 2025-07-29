import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Link } from 'expo-router';

const TransfersPage = () => {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [note, setNote] = useState('');

  // Mock contacts data
  const contacts = [
    { id: '1', name: 'Alex Johnson', account: '•••• 6789' },
    { id: '2', name: 'Maria Garcia', account: '•••• 4321' },
    { id: '3', name: 'James Wilson', account: '•••• 8765' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Transfer</Text>
        <Link href="../(modals)/transferhistory" asChild>
          <TouchableOpacity>
            <Text style={styles.historyLink}>History</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>€</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor={Colors.gray}
          />
        </View>
      </View>

      {/* Recipient Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Send to</Text>
        <View style={styles.contactsContainer}>
          {contacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.contactCard,
                selectedContact?.id === contact.id && styles.selectedContactCard
              ]}
              onPress={() => setSelectedContact(contact)}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactAccount}>{contact.account}</Text>
              </View>
              {selectedContact?.id === contact.id && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add new recipient</Text>
        </TouchableOpacity>
      </View>

      {/* Transfer Note */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="What's this transfer for?"
          value={note}
          onChangeText={setNote}
          placeholderTextColor={Colors.gray}
        />
      </View>

      {/* Transfer Button */}
      <TouchableOpacity 
        style={[
          defaultStyles.pillButton,
          styles.transferButton,
          (!amount || !selectedContact) && styles.disabledButton
        ]}
        disabled={!amount || !selectedContact}
      >
        <Text style={defaultStyles.buttonText}>Transfer Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  historyLink: {
    color: Colors.primary,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  contactsContainer: {
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  selectedContactCard: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  contactAccount: {
    fontSize: 14,
    color: Colors.gray,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  addButtonText: {
    marginLeft: 8,
    color: Colors.primary,
    fontWeight: '600',
  },
  noteInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 8,
    fontSize: 16,
    color: Colors.dark,
  },
  transferButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TransfersPage;