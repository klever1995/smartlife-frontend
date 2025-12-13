import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {

// Definición de constantes y estados locales
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

// Iniciar sesión
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      router.replace('/home'); 
    } catch (error: any) {
      Alert.alert('Error de login', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

// Ir a registro
  const handleRegister = () => {
    router.push('/register');
  };

//Renderizado de pantalla
  return (
    <SafeArea>
      <ImageBackground 
        source={require('@/assets/images/fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ThemedView style={styles.container}>
          <Image
            source={require('@/assets/images/logo3.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <ThemedText type="subtitle" style={styles.subtitle}>
            Tu asistente de nutrición inteligente
          </ThemedText>

          {/* Campo de usuario */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="gray"
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

          {/* Registro */}
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
      </ImageBackground>
    </SafeArea>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({

// Fondo de pantalla
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

// Contenedor principal
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.37)',
    paddingBottom: 60,
  },

// Logo de la app
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },

// Texto subtítulo
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    color: '#21700dff',
    marginBottom: 30,
    fontWeight: 'bold',
  },

// Contenedor de imput
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },

// Etiquetas de los imputs
  label: {
    fontSize: 17,
    color: '#000405ff',
    marginBottom: 6,
    fontWeight: '600',
  },

// Campos de texto
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

// Btn iniciar sesión
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
  },

// Btn deshabilitado
  buttonDisabled: {
    backgroundColor: '#a0c8f0',
  },

// Texto Btn
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

// Btn ir a registro
  registerButton: {
    marginTop: 15,
    padding: 10,
  },

// No cuenta
  noAccountText: {
    color: '#000000ff',
    fontSize: 17,
  },

// Registrarse
  registerTextLink: {
    color: '#0e5ab1ff',
    textDecorationLine: 'underline',
    fontSize: 17,
    fontWeight: '600',
  },

  

  
});


