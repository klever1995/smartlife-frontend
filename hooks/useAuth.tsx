import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interfaces que definen la estructura de un usuario 
interface User {
  username: string;
  email?: string;
  type: string;
  peso_kg?: number;
  estatura_cm?: number;
  edad?: number;
  sexo?: string;
}

// Interfaces que definen el contexto de autenticación
interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

// Cargar usuario
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@smartlife_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user', error);
    } finally {
      setLoading(false);
    }
  };

// Función de login
  const login = async (username: string, password: string) => {
    const url = `${API_URL}/users/login?username=${username}&password=${password}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error en login');
    }

    const userData = await response.json();
    await AsyncStorage.setItem('@smartlife_user', JSON.stringify(userData));
    setUser(userData);
  };

// Función de logout
  const logout = async () => {
    await AsyncStorage.removeItem('@smartlife_user');
    setUser(null);
  };

// Función de registro de usuario
  const register = async (userData: any) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error en registro');
    }

    const newUser = await response.json();
    await AsyncStorage.setItem('@smartlife_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};