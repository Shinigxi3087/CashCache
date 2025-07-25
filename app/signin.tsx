import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';

enum SignInType {
  Email,
  Google,
  Apple
}

const Signin = () => {
  const [email, setEmail] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignIn = async (type: SignInType) => {
    if (type === SignInType.Email) {
      try {
        const { supportedFirstFactors } = await signIn!.create({
          identifier: email,
        });
        const firstEmailFactor: any = supportedFirstFactors?.find((factor: any) => {
          return factor.strategy === 'email_code';
        });
        const { emailAddressId } = firstEmailFactor;
        await signIn!.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        });
        router.push({
          pathname: '/verify/[email]',
          params: { email, phone: email, signin: 'true' },
        });
      } catch (err) {
        console.log('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          Alert.alert('Error', err.errors[0].message);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
    keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Time to make moves</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your Email Address associated with your account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.input, { flex: 1 }]} 
          placeholder='Email Address' keyboardType='email-address' autoCapitalize='none' placeholderTextColor={Colors.gray}
          value={email} onChangeText={setEmail}/>
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            email !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onSignIn(SignInType.Email)}
          >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray}}/>
          <Text style={{ color: Colors.gray, fontSize: 20}}>or</Text>
          <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray}}/>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
          <TouchableOpacity style={[defaultStyles.pillButton, { backgroundColor: '#fff', flex: 1 }]} onPress={() => onSignIn(SignInType.Google)}>
            <Ionicons name="logo-google" size={24} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={[defaultStyles.pillButton, { backgroundColor: '#fff', flex: 1 }]} onPress={() => onSignIn(SignInType.Apple)}>
            <Ionicons name="logo-apple" size={24} color={'#000'} />
          </TouchableOpacity>
        </View>

      </View>
      <SafeAreaView style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ color: '#888', fontSize: 14 }}>
          © 2025 Safwan Khan. All rights reserved.
        </Text>
      </SafeAreaView>
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

export default Signin;