// Imports principales
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Tipos de datos para interpretación de fotos
interface Photo {
  image_url: string;
  interpretation: string;
  meal_type: string;
  timestamp: any;
}

interface DailyData {
  dateLabel: string;
  originalDate: Date; 
  photos: Photo[];
  recommendation?: string;
}

export default function GalleryScreen() {

// Estados y constantes de la pantalla
  const { user } = useAuth();
  const username = user?.username || "";
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingDay, setDeletingDay] = useState<string | null>(null); // <-- Nuevo estado para overlay
  const router = useRouter();

// Cargar galeria
  const fetchGallery = async () => {
    try {

    // Traer fotos
      const resPhotos = await fetch(`${API_URL}/photos/${username}`);
      const photosData: Photo[] = await resPhotos.json();
    //Traer recomendaciones
      const resRecs = await fetch(`${API_URL}/recommendations/${username}`);
      const recsData = await resRecs.json();
    // Agrupar por fecha
      const grouped: { [key: string]: DailyData } = {};
      photosData.forEach((photo: Photo) => {
        const originalDate = new Date(photo.timestamp);
        const dateLabel = originalDate.toLocaleDateString();
        if (!grouped[dateLabel]) {
          grouped[dateLabel] = { 
            dateLabel, 
            originalDate,
            photos: [] 
          };
        }
        grouped[dateLabel].photos.push(photo);
      });

      recsData.forEach((rec: any) => {
        const date = new Date(rec.timestamp).toLocaleDateString();
        if (grouped[date]) grouped[date].recommendation = rec.final_recommendation;
      });

      setDailyData(Object.values(grouped).reverse());
      await AsyncStorage.setItem('lastFetch', Date.now().toString());
    } catch (e: any) {
      console.log("Error fetching gallery:", e.message);
    }
  };

// Eliminar día completo
  const handleDeleteDay = (day: DailyData) => {
    Alert.alert(
      "Eliminar día",
      `¿Estás seguro de eliminar todas las fotos y recomendaciones del ${day.dateLabel}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingDay(day.dateLabel); 
              const year = day.originalDate.getFullYear();
              const month = String(day.originalDate.getMonth() + 1).padStart(2, '0');
              const dayNum = String(day.originalDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${dayNum}`;

              const res = await fetch(`${API_URL}/photos/delete-by-date/${username}?date=${dateStr}`, {
                method: 'DELETE'
              });

              setDeletingDay(null); 

              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error ${res.status}: ${errorText}`);
              }

              const result = await res.json();
              if (result.success) {
                setDailyData(prev => prev.filter(dayItem => dayItem.dateLabel !== day.dateLabel));
                await AsyncStorage.setItem('lastUpdate', Date.now().toString());
                Alert.alert("Éxito", result.message || "Día eliminado correctamente");
              } else {
                Alert.alert("Error", result.message || "No se pudo eliminar");
              }
            } catch (error: any) {
              setDeletingDay(null);
              console.error("Error completo eliminando:", error);
              Alert.alert("Error", error.message || "No se pudo eliminar. Verifica la consola.");
            }
          }
        }
      ]
    );
  };

// Cargar al cambiar de pantalla
  useFocusEffect(
    useCallback(() => {
      const checkAndLoadGallery = async () => {
        try {
          const lastUpdate = await AsyncStorage.getItem('lastUpdate');
          const lastFetch = await AsyncStorage.getItem('lastFetch');

          if (!lastFetch || (lastUpdate && parseInt(lastUpdate) > parseInt(lastFetch))) {
            await fetchGallery();
          } else if (dailyData.length === 0) {
            await fetchGallery();
          }
        } catch (error) {
          console.log("Error checking updates:", error);
        }
      };

      checkAndLoadGallery();
    }, [])
  );

// Deslizar para actualizar
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGallery();
    setRefreshing(false);
  };

// Volver al home
  const goHome = () => {
    router.push("/home");
  };

// Manejo de estado vacio
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goHome();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  if (dailyData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay historial aún. ¡Sube tu primera foto!</Text>
      </View>
    );
  }

//Renderizado de la pantalla
  return (
    <SafeArea>
      <View style={{ flex: 1 }}>
        {/* Overlay mientras se elimina */}
        {deletingDay && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
          }}>
            <View style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}>
              <Text style={{ fontWeight: '600', marginBottom: 10 }}>Eliminando {deletingDay}...</Text>
              <ActivityIndicator size="large" color="#d32f2f" />
            </View>
          </View>
        )}

        {/* Flecha superior izquierda */}
        <TouchableOpacity style={styles.backButton} onPress={goHome}>
          <Ionicons name="arrow-back" size={28} color="#0077b6" />
        </TouchableOpacity>

        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {dailyData.map((day: DailyData, idx: number) => (
            <View key={idx} style={styles.dayContainer}>
              {/* Botón rojo de eliminar */}
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteDay(day)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
              
              <Text style={styles.dateLabel}>{day.dateLabel}</Text>
              <View style={styles.photosRow}>
                {day.photos.slice(0, 3).map((photo: Photo, i: number) => (
                  <TouchableOpacity key={i}>
                    <Image source={{ uri: photo.image_url }} style={styles.photoThumb} />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.summary}>
                {day.photos.length} fotos - {day.photos.map((p: Photo) => p.meal_type).join(", ")}
              </Text>
              {day.recommendation && (
                <Text style={styles.recommendation} numberOfLines={2}>
                  💡 {day.recommendation}
                </Text>
              )}
              <TouchableOpacity 
                style={styles.detailButton} 
                onPress={() => router.push(`/details?date=${encodeURIComponent(day.dateLabel)}`)}
              >
                <Text style={styles.detailButtonText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeArea>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({

//Contenedor principal
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f7', 
    padding: 10, 
},

// Contenedor de cada día
  dayContainer: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3,
    position: 'relative'
  },

// Fecha del día
  dateLabel: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 10, 
},

// Contenedor miniaturas
  photosRow: { 
    flexDirection: 'row', 
    marginBottom: 10, 
},

// Miniatura de foto
  photoThumb: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    marginRight: 10, 
},

// Resumen día
  summary: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 5, 
},

// Recomendación
  recommendation: { 
    fontSize: 14, 
    color: '#0077b6', 
    marginBottom: 10, 
},

// Btn ver detalle
  detailButton: { 
    backgroundColor: '#0077b6', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
},

// Texto ver detalle
  detailButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
},

// Historial vacio
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
},

// Texto historial vacio
  emptyText: { 
    fontSize: 18, 
    color: '#555', 
    textAlign: 'center', 
    paddingHorizontal: 20, 
},

// Btn regresar
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
  },

// Btn eliminar
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#d32f2f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 5,
  },

// Texto Btn eliminar
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
