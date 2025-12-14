// Imports principales
import { styles } from '@/app/styles/detailsStyle';
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interface de datos para foto
interface Photo {
  image_url: string;
  interpretation: string;
  meal_type: string;
  timestamp: any;
}

// Interface de datos para detalles
interface DailyDetail {
  photos: Photo[];
  recommendation?: string;
  recommendations?: string[];
}

export default function DetailsScreen() {
  // Estados y constantes de la pantalla
  const { user } = useAuth();
  const username = user?.username || "";
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();

  const [data, setData] = useState<DailyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Btn físico de back a gallery
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/gallery");
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // Obtener detalles del día
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

  // Ejecutar carga inicial
  useEffect(() => {
    fetchDetails();
  }, [date]);

  // Deslizar para actualizar
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  };

  // Regresar a galería
  const goBack = () => {
    router.push("/gallery");
  };

  // Pantalla de carga
  if (loading) {
    return (
      <SafeArea>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeArea>
    );
  }

  // Sin datos
  if (!data || data.photos.length === 0) {
    return (
      <SafeArea>
        <View style={styles.emptyContainer}>
          <Ionicons name="image-outline" size={70} color="#757575" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No hay fotos para este día</Text>
          <Text style={styles.emptySubtitle}>No se encontraron registros para {date}</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.emptyButtonText}>Volver a galería</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  // Renderizado de la pantalla
  return (
    <SafeArea>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#1565C0" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="calendar" size={20} color="#2E7D32" />
            <Text style={styles.headerTitle}>Detalles del día</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Fecha */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{date}</Text>
          <Text style={styles.photoCount}>
            {data.photos.length} {data.photos.length === 1 ? 'foto' : 'fotos'}
          </Text>
        </View>

        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Lista de fotos */}
          {data.photos.map((photo, idx) => (
            <View key={idx} style={styles.photoCard}>
              <View style={styles.photoHeader}>
                <View style={styles.mealTypeContainer}>
                  <Ionicons name="restaurant-outline" size={18} color="#2E7D32" />
                  <Text style={styles.mealType}>{photo.meal_type}</Text>
                </View>
                <View style={styles.photoNumber}>
                  <Text style={styles.photoNumberText}>{idx + 1}</Text>
                </View>
              </View>
              
              <Image source={{ uri: photo.image_url }} style={styles.photo} />
              
              <View style={styles.interpretationContainer}>
                <Ionicons name="analytics-outline" size={18} color="#1565C0" style={styles.interpretationIcon} />
                <Text style={styles.interpretation}>{photo.interpretation}</Text>
              </View>
            </View>
          ))}

          {/* Recomendaciones detalladas */}
          {data.recommendations && data.recommendations.length > 0 && (
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Ionicons name="bulb-outline" size={22} color="#FF9800" />
                <Text style={styles.recommendationTitle}>Recomendaciones de IA</Text>
              </View>
              
              <View style={styles.recommendationList}>
                {data.recommendations.map((line, idx) => (
                  <View key={idx} style={styles.recommendationItem}>
                    <View style={styles.bulletPoint}>
                      <Ionicons name="chevron-forward" size={12} color="#FF9800" />
                    </View>
                    <Text style={styles.recommendationText}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recomendación final */}
          {data.recommendation && (
            <View style={styles.finalRecommendationCard}>
              <View style={styles.finalRecommendationHeader}>
                <Ionicons name="star" size={22} color="#FFC107" />
                <Text style={styles.finalRecommendationTitle}>Recomendación final</Text>
              </View>
              <Text style={styles.finalRecommendationText}>{data.recommendation}</Text>
            </View>
          )}

          {/* Espacio al final */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeArea>
  );
}