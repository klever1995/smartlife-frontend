import { SafeArea } from '@/components/ui/safe-area';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
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

// Registrar usuario
  const handleRegister = async () => {
    if (!username || !email || !password || !sexo) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
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
        const err = await response.json();
        throw new Error(err.detail || "Error al registrar");
      }

      Alert.alert("Éxito", "Usuario registrado correctamente");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

//Renderizado de pantalla
  return (
    <SafeArea>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#e0f7fa" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
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
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeArea>
  );
}

// Estilos de la pantalla
const pickerStyles = {

// Estilo del input para iOS 
  inputIOS: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#cfd8dc",
    marginBottom: 15,
  },

// Estilo del input para android
  inputAndroid: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#cfd8dc",
    marginBottom: 15,
  },
};

const styles = StyleSheet.create({

// Contenedor principal
  container: { 
    padding: 25, 
    justifyContent: "center", 
},

// Título general
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 30, 
},

// Cuadros de texto
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#cfd8dc",
    marginBottom: 15,
  },

// Etiquetas
  label: { 
    fontWeight: "600", 
    marginBottom: 5, 
    marginTop: 10, 
},

// Contenedor horizontal
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 10, 
},

// Btn + y -
  stepButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#0077b6",
    alignItems: "center",
    justifyContent: "center",
  },

// Texto Btn + y -
  stepText: { 
    color: "#fff", 
    fontSize: 25, 
    fontWeight: "600", 
},

// Valor entre botones
  valueText: { 
    fontSize: 18, 
    fontWeight: "600", 
},

// Btn selector de fecha
  dateButton: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#cfd8dc",
    marginBottom: 15,
  },

// Texto fecha
  dateText: { 
    fontSize: 16, 
},

// Btn guardar
  button: { 
    backgroundColor: "#0077b6", 
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 20, 
},
  
// Texto btn principal
  buttonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16, 
},

// Btn regresar
  backButton: { 
    marginTop: 20, 
    alignItems: "center", 
},

// Texto Btn regresar
  backText: { 
    color: "#0077b6", 
    textDecorationLine: "underline", 
},
});
