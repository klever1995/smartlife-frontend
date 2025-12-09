// Imports principales
import { SafeArea } from '@/components/ui/safe-area';
import { sharedButtonStyles } from '@/constants/buttonStyles';
import { useAuth } from '@/hooks/useAuth';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Tipo de datos para recomendaciones
interface RecommendationData {
  photo_ids: string[];
  interpretations: string[];
  recommendations: string[];
  final_recommendation: string;
  timestamp?: string;
}

export default function HomeScreen() {

// Estados y constantes de la pantalla
  const router = useRouter();
  const { user, logout } = useAuth();
  const username = user?.username || "";
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [lastSavedRecommendation, setLastSavedRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);

// Solicitar permisos de cámara
  useEffect(() => {
    (async () => {
      const camStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(camStatus.status === "granted");
    })();
  }, []);

// Cargar última recomendación
  useEffect(() => {
  const fetchLastRecommendation = async () => {
    if (!username) return;
    try {
      const res = await fetch(`${API_URL}/recommendations/${username}`);
      if (!res.ok) throw new Error("Error cargando la última recomendación");
      const data: RecommendationData[] = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const today = new Date().toDateString();
        const todayRecs = data.filter(
          rec => rec?.timestamp && new Date(rec.timestamp).toDateString() === today
        );

        if (todayRecs.length > 0) {
          const sorted = todayRecs.sort(
            (a, b) => (new Date(b.timestamp || 0)).getTime() - (new Date(a.timestamp || 0)).getTime()
          );
          setLastSavedRecommendation(sorted[0]);
        } else {
          setLastSavedRecommendation(null);
        }
      } else {
        setLastSavedRecommendation(null);
      }
    } catch (e: any) {
      console.log("Error fetching last recommendation:", e?.message || e);
      setLastSavedRecommendation(null);
    }
  };
  fetchLastRecommendation();
}, [username]);


// Abrir la cámara
  const handleUploadPhoto = () => {
    if (!cameraPermission) {
      Alert.alert("Permiso denegado", "Debes permitir el acceso a la cámara");
      return;
    }
    router.push("/camera");
  };

// Generar una recomendación
  const handleGenerateRecommendation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/recommendations/recommend/${username}`);
      if (!res.ok) throw new Error("No hay fotos interpretadas hoy para generar recomendación");
      const data: RecommendationData = await res.json();

      if (data.photo_ids.length === 0) {
        Alert.alert("Info", "No hay fotos subidas hoy, no se puede guardar recomendación.");
        setRecommendation(null);
        return;
      }

      setRecommendation(data);
      Alert.alert(
        "Recomendación generada",
        data.final_recommendation,
        [
          { text: "Cancelar", style: "cancel", onPress: () => setRecommendation(null) },
          { text: "Guardar", onPress: async () => await handleSaveRecommendation(data) }
        ]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

// Guardar la recomendación
  const handleSaveRecommendation = async (rec: RecommendationData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/recommendations/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          photo_ids: rec.photo_ids,
          interpretations: rec.interpretations,
          recommendations: rec.recommendations,
          final_recommendation: rec.final_recommendation
        })
      });
      if (!res.ok) throw new Error("Error guardando la recomendación");
      await res.json();

      await AsyncStorage.setItem('lastUpdate', Date.now().toString());
      setLastSavedRecommendation(rec);
      setRecommendation(null);
      Alert.alert("Guardado", "La recomendación se ha guardado correctamente.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

// Cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); 
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

//Renderizado de pantalla
  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Hola, {username}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeader}>{new Date().toLocaleDateString()}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={sharedButtonStyles.button} onPress={handleUploadPhoto}>
            <FontAwesome5 name="upload" size={18} color="white" />
            <Text style={[styles.buttonText, sharedButtonStyles.buttonTextMargin]}>Subir foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sharedButtonStyles.button} onPress={() => router.push("/gallery")}>
            <FontAwesome5 name="images" size={18} color="white" />
            <Text style={[styles.buttonText, sharedButtonStyles.buttonTextMargin]}>Ver historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sharedButtonStyles.button} onPress={handleGenerateRecommendation} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <MaterialIcons name="lightbulb" size={18} color="white" />
                <Text style={[styles.buttonText, sharedButtonStyles.buttonTextMargin]}>Generar recomendación diaria</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.lastRecContainer}>
          <Text style={styles.lastRecTitle}>Última recomendación de hoy:</Text>
          {lastSavedRecommendation?.recommendations && lastSavedRecommendation.recommendations.length > 0 ? (
            lastSavedRecommendation.recommendations.map((line, idx) => (
              <Text key={idx} style={styles.lastRecText}>{line}</Text>
            ))
          ) : (
            <Text style={styles.lastRecText}>No has generado ninguna recomendación hoy.</Text>
          )}
        </View>

        <Text style={styles.reminder}>¡No olvides subir tus fotos hoy!</Text>
      </ScrollView>
    </SafeArea>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({

// Contenedor principal
  container: { 
    flex: 1, 
    backgroundColor: "#e0f7fa", 
    padding: 20, 
},

// Encabezado
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 5, 
},

// Texto saludo
  header: { 
    fontSize: 28, 
    fontWeight: "700", 
},

// Texto fecha
  subHeader: { 
    fontSize: 16, 
    marginBottom: 20, 
},

// Contenedor Btn
  buttonsContainer: { 
    marginTop: 20, 
},

// Texto Btn
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600", 
},

// Texto recordatorio
  reminder: { 
    marginTop: 20, 
    fontSize: 16, 
    fontStyle: "italic" ,
},

// Btn logout
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
  },

// Card Recomendación
  lastRecContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },

// Titulo Card
  lastRecTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 5, 
},

// Texto Card
  lastRecText: { 
    fontSize: 14, 
    color: "#555", 
},
});
