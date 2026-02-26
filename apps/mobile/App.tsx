import { StyleSheet, Text, View } from 'react-native';
import { helloWorld } from '@agri-scan/shared'; // <-- Lấy từ chung

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agri-Scan AI Mobile</Text>
      <Text style={styles.message}>
        Shared: {helloWorld()}
      </Text>
    </View>
  );
}

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