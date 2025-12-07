import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      await login(username, password);
      router.replace('/(tabs)/home'); // navegación al home dentro de (tabs)
    } catch (error: any) {
      Alert.alert('Error de login', error.message || 'Credenciales incorrectas');
    }
  };

  const handleRegister = () => {
  router.push('/register');
  };


  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/logo3.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <ThemedText type="title" style={styles.title}>
        SmartFitness
      </ThemedText>
      
      <ThemedText type="subtitle" style={styles.subtitle}>
        Tu asistente de nutrición inteligente
      </ThemedText>

      {/* Campo de usuario */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Campo de contraseña */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      {/* Botón de login */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText type="default" style={styles.buttonText}>
            Iniciar Sesión
          </ThemedText>
        )}
      </TouchableOpacity>

      {/* Registro: "¿No tienes cuenta? Regístrate" con solo "Regístrate" marcado */}
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.noAccountText}>
          ¿No tienes cuenta?
          <Text style={styles.registerTextLink}> Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: '#e0f7fa',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: '#1D3D47',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    color: '#0A2A32',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#cfd8dc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c8f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 15,
    padding: 10,
  },
  noAccountText: {
    color: '#555',
    fontSize: 14,
  },
  registerTextLink: {
    color: '#4a90e2',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '600',
  },
});
