import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface RecommendationData {
  photo_ids: string[];
  interpretations: string[];
  recommendations: string[];
  final_recommendation: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const username = user?.username || "";
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);

  // Pedir permiso de cámara
  useEffect(() => {
    (async () => {
      const camStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(camStatus.status === "granted");
    })();
  }, []);

  const handleUploadPhoto = () => {
    if (!cameraPermission) {
      Alert.alert("Permiso denegado", "Debes permitir el acceso a la cámara");
      return;
    }
    router.push("/(tabs)/camera");
  };

  const handleGenerateRecommendation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/recommendations/recommend/${username}`);
      if (!res.ok) throw new Error("Error generando recomendación");
      const data: RecommendationData = await res.json();
      setRecommendation(data);
      Alert.alert("Recomendación generada", data.final_recommendation);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async () => {
    if (!recommendation) return;
    Alert.alert(
      "Guardar recomendación",
      "¿Estás seguro de que deseas guardar esta recomendación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Guardar",
          onPress: async () => {
            try {
              setLoading(true);
              const res = await fetch(`${API_URL}/recommendations/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username,
                  photo_ids: recommendation.photo_ids,
                  interpretations: recommendation.interpretations,
                  recommendations: recommendation.recommendations,
                  final_recommendation: recommendation.final_recommendation
                })
              });
              if (!res.ok) throw new Error("Error guardando la recomendación");
              await res.json();
              Alert.alert("Guardado", "La recomendación se ha guardado correctamente.");
              setRecommendation(null);
            } catch (e: any) {
              Alert.alert("Error", e.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/(tabs)"); // vuelve a pantalla de login
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de cerrar sesión en la esquina superior derecha */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Hola, {username}</Text>
      <Text style={styles.subHeader}>{new Date().toLocaleDateString()}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
          <Text style={styles.buttonText}>📤 Subir foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/gallery")}>
          <Text style={styles.buttonText}>🖼️ Ver historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGenerateRecommendation} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>💡 Generar recomendación diaria</Text>}
        </TouchableOpacity>

        {recommendation && (
          <TouchableOpacity style={[styles.button, { backgroundColor: "#009688" }]} onPress={handleSaveRecommendation}>
            <Text style={styles.buttonText}>💾 Guardar recomendación</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.reminder}>¡No olvides subir tus fotos hoy!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0f7fa", padding: 20 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 5 },
  subHeader: { fontSize: 16, marginBottom: 20 },
  buttonsContainer: { marginTop: 20 },
  button: {
    backgroundColor: "#0077b6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  reminder: { marginTop: 20, fontSize: 16, fontStyle: "italic" },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 15,
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});