import { pickerStyles, styles } from '@/app/styles/registerStyle';
import { SafeArea } from '@/components/ui/safe-area';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  // Estados para datos de usuario
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesoKg, setPesoKg] = useState(70);
  const [estaturaCm, setEstaturaCm] = useState(170);
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Calcular edad
  const calcularEdad = (fecha: Date) => {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
    return edad;
  };

  const edadCalculada = calcularEdad(fechaNacimiento);

  // Validación de email en el frontend
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de contraseña en el frontend
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // Registrar usuario
  const handleRegister = async () => {
    // Validación de campos obligatorios
    if (!username || !email || !password || !sexo) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    // Validación de formato email
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido");
      return;
    }

    // Validación de fortaleza de contraseña
    if (!isValidPassword(password)) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
          peso_kg: pesoKg,
          estatura_cm: estaturaCm,
          edad: edadCalculada,
          sexo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejar errores de validación de Pydantic (422)
        if (response.status === 422 && errorData.detail) {
          const validationErrors = errorData.detail.map((err: any) => 
            `• ${err.loc[err.loc.length - 1]}: ${err.msg}`
          ).join('\n');
          throw new Error(`Error de validación:\n${validationErrors}`);
        }
        
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      Alert.alert("Éxito", "Usuario registrado correctamente");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Error desconocido al registrar");
    }
  };

  //Renderizado de pantalla
  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#757575"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#757575"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#757575"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Peso */}
            <Text style={styles.label}>Peso (kg)</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setPesoKg((p) => Math.max(1, p - 1))}
              >
                <Text style={styles.stepText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.valueText}>{pesoKg} kg</Text>

              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setPesoKg((p) => p + 1)}
              >
                <Text style={styles.stepText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Estatura */}
            <Text style={styles.label}>Estatura (cm)</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setEstaturaCm((e) => Math.max(50, e - 1))}
              >
                <Text style={styles.stepText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.valueText}>{estaturaCm} cm</Text>

              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setEstaturaCm((e) => e + 1)}
              >
                <Text style={styles.stepText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Fecha de nacimiento */}
            <Text style={styles.label}>Fecha de nacimiento</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateText}>
                {fechaNacimiento.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={fechaNacimiento}
                mode="date"
                maximumDate={new Date()}
                display="spinner"
                onChange={(e, date) => {
                  setShowPicker(false);
                  if (date) setFechaNacimiento(date);
                }}
              />
            )}

            {/* Sexo */}
            <RNPickerSelect
              style={pickerStyles}
              placeholder={{ label: "Selecciona tu sexo", value: "" }}
              onValueChange={(value) => setSexo(value)}
              value={sexo}
              items={[
                { label: "Masculino", value: "M" },
                { label: "Femenino", value: "F" },
              ]}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>Volver al Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}