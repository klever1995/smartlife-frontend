import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Photo {
  image_url: string;
  interpretation: string;
  meal_type: string;
  timestamp: any;
}

interface DailyData {
  dateLabel: string;
  photos: Photo[];
  recommendation?: string;
}

export default function GalleryScreen() {
  const { user } = useAuth();
  const username = user?.username || "";
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchGallery = async () => {
    try {
      const resPhotos = await fetch(`${API_URL}/photos/${username}`);
      const photosData: Photo[] = await resPhotos.json();

      const resRecs = await fetch(`${API_URL}/recommendations/${username}`);
      const recsData = await resRecs.json();

      const grouped: { [key: string]: DailyData } = {};
      photosData.forEach((photo: Photo) => {
        const date = new Date(photo.timestamp).toLocaleDateString();
        if (!grouped[date]) grouped[date] = { dateLabel: date, photos: [] };
        grouped[date].photos.push(photo);
      });

      recsData.forEach((rec: any) => {
        const date = new Date(rec.timestamp).toLocaleDateString();
        if (grouped[date]) grouped[date].recommendation = rec.final_recommendation;
      });

      setDailyData(Object.values(grouped).reverse());
    } catch (e: any) {
      console.log("Error fetching gallery:", e.message);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGallery();
    setRefreshing(false);
  };

  const goHome = () => {
    router.push("/(tabs)/home");
  };

  // CORRECCIÓN: useFocusEffect con subscription.remove()
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goHome();
        return true; // Previene el comportamiento por defecto
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup CORRECTO: remueve la suscripción
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

  return (
    <View style={{ flex: 1 }}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f7', padding: 10 },
  dayContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  dateLabel: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  photosRow: { flexDirection: 'row', marginBottom: 10 },
  photoThumb: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  summary: { fontSize: 14, color: '#555', marginBottom: 5 },
  recommendation: { fontSize: 14, color: '#0077b6', marginBottom: 10 },
  detailButton: { backgroundColor: '#0077b6', padding: 10, borderRadius: 8, alignItems: 'center' },
  detailButtonText: { color: '#fff', fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#555', textAlign: 'center', paddingHorizontal: 20 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
  },
});