import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const AddContact = () => {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const router = useRouter();

  const isValid = name.trim() !== '' && account.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.header}>Add New Contact</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter contact name"
            placeholderTextColor={Colors.gray}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            placeholder="Enter account number"
            placeholderTextColor={Colors.gray}
            style={styles.input}
            value={account}
            onChangeText={setAccount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !isValid && styles.disabledButton]}
          onPress={handleSave}
          disabled={!isValid}
        >
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.dark,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  saveButton: {
    backgroundColor: Colors.dark,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AddContact;
