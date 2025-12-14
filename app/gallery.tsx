// Imports principales
import { styles } from '@/app/styles/galleryStyle';
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interface de datos para foto
interface Photo {
  image_url: string;
  interpretation: string;
  meal_type: string;
  timestamp: any;
}

// Interface de datos para colección de interpetaciones
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
  const [deletingDay, setDeletingDay] = useState<string | null>(null);
  const router = useRouter();

  // Función para obtener galería desde la API
  const fetchGallery = async () => {
    try {
      const resPhotos = await fetch(`${API_URL}/photos/${username}`);
      const photosData: Photo[] = await resPhotos.json();
      const resRecs = await fetch(`${API_URL}/recommendations/${username}`);
      const recsData = await resRecs.json();
      
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

  // Manejar eliminación de un día completo
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
              if (!res.ok) throw new Error(`Error ${res.status}`);
              
              const result = await res.json();
              if (result.success) {
                setDailyData(prev => prev.filter(dayItem => dayItem.dateLabel !== day.dateLabel));
                await AsyncStorage.setItem('lastUpdate', Date.now().toString());
                Alert.alert("Éxito", "Día eliminado correctamente");
              } else {
                Alert.alert("Error", "No se pudo eliminar");
              }
            } catch (error: any) {
              setDeletingDay(null);
              Alert.alert("Error", "No se pudo eliminar. Intenta nuevamente.");
            }
          }
        }
      ]
    );
  };

  // Cargar galería al enfocar la pantalla
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

  // Función de pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGallery();
    setRefreshing(false);
  };

  // Navegar al inicio
  const goHome = () => router.push("/home");

  // Manejar botón físico de retroceso
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

  // Estado vacío: no hay datos
  if (dailyData.length === 0) {
    return (
      <SafeArea>
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={70} color="#2E7D32" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Tu historial está vacío</Text>
          <Text style={styles.emptySubtitle}>¡Sube tu primera foto para comenzar!</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={goHome}>
            <Text style={styles.emptyButtonText}>Ir al inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <View style={{ flex: 1 }}>
        {/* Header simple */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goHome}>
            <Ionicons name="arrow-back" size={24} color="#1565C0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historial de Fotos</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Overlay de eliminación */}
        {deletingDay && (
          <View style={styles.deleteOverlay}>
            <View style={styles.deleteModal}>
              <ActivityIndicator size="large" color="#FF9800" />
              <Text style={styles.deleteModalText}>Eliminando {deletingDay}</Text>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {dailyData.map((day: DailyData, idx: number) => (
            <View key={idx} style={styles.dayCard}>
              {/* Encabezado con fecha y botón eliminar */}
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={18} color="#2E7D32" />
                  <Text style={styles.dateLabel}>{day.dateLabel}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDay(day)}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Miniaturas de fotos */}
              <View style={styles.photosRow}>
                {day.photos.slice(0, 3).map((photo: Photo, i: number) => (
                  <View key={i} style={styles.photoContainer}>
                    <Image source={{ uri: photo.image_url }} style={styles.photoThumb} />
                    <Text style={styles.mealType}>{photo.meal_type || 'Comida'}</Text>
                  </View>
                ))}
              </View>

              {/* Estadísticas */}
              <View style={styles.statsContainer}>
                <Text style={styles.photoCount}>
                  {day.photos.length} {day.photos.length === 1 ? 'foto' : 'fotos'}
                </Text>
                <Text style={styles.mealTypes}>
                  {day.photos.map(p => p.meal_type).filter(Boolean).join(", ")}
                </Text>
              </View>

              {/* Recomendación IA */}
              {day.recommendation && (
                <View style={styles.recommendationContainer}>
                  <Ionicons name="bulb-outline" size={18} color="#FF9800" />
                  <Text style={styles.recommendationText} numberOfLines={3}>
                    {day.recommendation}
                  </Text>
                </View>
              )}

              {/* Botón ver detalle */}
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => router.push(`/details?date=${encodeURIComponent(day.dateLabel)}`)}
              >
                <Text style={styles.detailButtonText}>Ver detalle completo</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeArea>
  );
}