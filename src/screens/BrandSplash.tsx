import React from 'react';
import { Image, ImageBackground, SafeAreaView, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function BrandSplash() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
        imageStyle={{ opacity: 0.08 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/Logo.png')}
            style={{ width: 96, height: 96, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text variant="headlineSmall" style={{ color: '#173558', fontWeight: '900' }}>
            Kido CRM Center
          </Text>
          <Text style={{ color: '#6B7280', marginTop: 4 }}>Omnichannel Support</Text>
          <View style={{ height: 28 }} />
          <ActivityIndicator animating color="#1EBE71" />
        </View>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' }}>
          <Text style={{ color: '#6B7280' }}>© {new Date().getFullYear()} Kido CRM Center</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}


