import { StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setTokenStorage } from '@agri-scan/shared';

setTokenStorage({
  getAccessToken: async () => {
    return await SecureStore.getItemAsync('accessToken');
  },
  getRefreshToken: async () => {
    return await SecureStore.getItemAsync('refreshToken');
  },
  saveTokens: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync('accessToken', access);
    await SecureStore.setItemAsync('refreshToken', refresh);
  },
  clearTokens: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
  },
});