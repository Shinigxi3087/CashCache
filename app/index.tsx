import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

const HomeScreen = () => {
    const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
    const router = useRouter();
    
    return (
      <View style={styles.container}>
        { assets && (
          <Video resizeMode={ResizeMode.COVER}
            isMuted
            isLooping
            shouldPlay
            source={{ uri: assets[0].uri }}
            style={styles.video}/>
        )}
        <View style={styles.centerContent}>
          <Text style={styles.header}>{'Make your\nmoney work'}</Text>
        </View>
        <SafeAreaView style={styles.buttons}>
            <TouchableOpacity
            style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark}]} 
            onPress={() => router.push('/signin')}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[defaultStyles.pillButton, { flex: 1, backgroundColor: 'white'}]} 
            onPress={() => router.push('/signup')}>
                <Text style={{ color: 'black', fontSize: 22, fontWeight: '500' }}>Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    headerContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: 100, 
    },
    header: {
      fontSize: 30,
      fontWeight: '900',
      textTransform: 'uppercase',
      color: 'white',
      textAlign: 'center',
      width: '100%',
      lineHeight: 38,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 60,
      paddingHorizontal: 20,
    },
  });

export default HomeScreen;