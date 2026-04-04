// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相机权限才能拍照识别蘑菇');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      // 跳转到识别结果页面，并传递图片URI
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
    });
    
    if (!result.canceled) {
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍄 蘑菇识别助手</Text>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📷 拍照识别</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage}>
        <Text style={styles.buttonText}>🖼️ 从相册选择</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        ⚠️ 本应用识别结果仅供参考，请勿用于实际食用决策
      </Text>
    </View>
  );
}