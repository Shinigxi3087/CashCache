import { StyleSheet, Text, View } from 'react-native'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { BlurView } from 'expo-blur'
import CustomHeader from '@/components/CustomHeader'

const Layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.dark,
      tabBarBackground: () => (
        <BlurView
            intensity={100}
            tint={'extraLight'}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
        />
      ),
      tabBarStyle: {
        backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 0,
      }
    }}>
      <Tabs.Screen name='home' options={{
        title: 'Home', 
        tabBarIcon: ({size, color}) => (
          <Ionicons name='home' size={size} color={color}/>
        ),
        header: () => <CustomHeader />,
        headerTransparent: true,
      }}/>
      <Tabs.Screen name='transfers' options={{
        title: 'Transfers', 
        tabBarIcon: ({size, color}) => (
          <Ionicons name='repeat' size={size} color={color}/>
        ),
        header: () => <CustomHeader />,
        headerTransparent: true,
      }}/>
      <Tabs.Screen name='invest' options={{
        title: 'Invest', 
        tabBarIcon: ({size, color}) => (
          <FontAwesome name='line-chart' size={size} color={color}/>
        ),
        header: () => <CustomHeader />,
        headerTransparent: true,
      }}/>
      <Tabs.Screen name='lifestyle' options={{
        title: 'Lifestyle', 
        tabBarIcon: ({size, color}) => (
          <Ionicons name='leaf' size={size} color={color}/>
        ),
        header: () => <CustomHeader />,
        headerTransparent: true,
      }}/>
      <Tabs.Screen name='crypto' options={{
        title: 'Crypto', 
        tabBarIcon: ({size, color}) => (
          <FontAwesome name='bitcoin' size={size} color={color}/>
        ), 
        header: () => <CustomHeader />,
        headerTransparent: true,
      }}/>
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})