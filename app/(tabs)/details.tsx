import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Photo {
  image_url: string;
  interpretation: string;
  meal_type: string;
  timestamp: any;
}

interface DailyDetail {
  photos: Photo[];
  recommendation?: string;
  recommendations?: string[];
}

export default function DetailsScreen() {
  const { user } = useAuth();
  const username = user?.username || "";
  const router = useRouter();

  const { date } = useLocalSearchParams<{ date: string }>();

  const [data, setData] = useState<DailyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Botón físico de retroceso
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/(tabs)/gallery");
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const resPhotos = await fetch(`${API_URL}/photos/${username}`);
      const photosData: Photo[] = await resPhotos.json();

      const resRecs = await fetch(`${API_URL}/recommendations/${username}`);
      const recsData = await resRecs.json();

      const selectedPhotos = photosData.filter(photo =>
        new Date(photo.timestamp).toLocaleDateString() === date
      );

      const rec = recsData.find((recItem: any) =>
        new Date(recItem.timestamp).toLocaleDateString() === date
      );

      setData({
        photos: selectedPhotos,
        recommendation: rec?.final_recommendation,
        recommendations: rec?.recommendations,
      });
    } catch (e: any) {
      console.log("Error fetching details:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [date]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    );
  }

  if (!data || data.photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fotos para este día.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.dateLabel}>Detalles del día: {date}</Text>

      {data.photos.map((photo, idx) => (
        <View key={idx} style={styles.photoContainer}>
          <Image source={{ uri: photo.image_url }} style={styles.photo} />
          <Text style={styles.mealType}>{photo.meal_type}</Text>
          <Text style={styles.interpretation}>{photo.interpretation}</Text>
        </View>
      ))}

      {data.recommendations && data.recommendations.length > 0 && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>💡 Recomendación completa</Text>
          {data.recommendations.map((line, idx) => (
            <Text key={idx} style={styles.recommendationText}>{line}</Text>
          ))}
        </View>
      )}

      {data.recommendation && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>⭐ Recomendación final</Text>
          <Text style={styles.recommendationText}>{data.recommendation}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f7', padding: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#555', textAlign: 'center', paddingHorizontal: 20 },
  dateLabel: { fontSize: 20, fontWeight: '700', marginBottom: 15, textAlign: 'center' },
  photoContainer: { backgroundColor: '#fff', padding: 10, marginBottom: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  photo: { width: '100%', height: 250, borderRadius: 10, marginBottom: 10 },
  mealType: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  interpretation: { fontSize: 14, color: '#555' },
  recommendationContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 15 },
  recommendationTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5, color: '#0077b6' },
  recommendationText: { fontSize: 14, color: '#555' },
});