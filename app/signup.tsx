import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';

const Signup = () => {
  const [email, setEmail] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const { signUp } = useSignUp();

  const onSignUp = async () => {
    try {
      await signUp!.create({
        emailAddress: email,
      });
      await signUp!.prepareEmailAddressVerification();
      router.push({ pathname: '/verify/[email]', params: { email, phone: email } });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
    keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's Get Started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your Email Address. We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.input, { flex: 1 }]} 
          placeholder='Email Address' keyboardType='email-address' autoCapitalize='none' placeholderTextColor={Colors.gray}
          value={email} onChangeText={setEmail}/>
        </View>
        <Link href={'/signin'} replace asChild>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            email !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={onSignUp}
          >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.dark,
  },
  disabled: {
    backgroundColor: Colors.dark,
  },
});

export default Signup