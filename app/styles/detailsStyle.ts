import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  // Header de navegación con botón de regreso
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  
  // Centro del header con icono y título
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  // Título del header
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  
  // Botón para volver atrás
  backButton: {
    padding: 8,
    borderRadius: 8,
  },

  // Contenedor de información de fecha
  dateContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  // Etiqueta de fecha grande
  dateLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  
  // Contador de fotos 
  photoCount: {
    fontSize: 14,
    color: '#757575',
  },

  // Contenedor principal del scroll view
  container: {
    flex: 1,
    padding: 16,
  },

  // Tarjeta individual para cada foto
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // Header de cada tarjeta de foto
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  
  // Contenedor del tipo de comida con icono
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Texto del tipo de comida
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  
  // Círculo con número de foto
  photoNumber: {
    backgroundColor: '#E8F5E9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Texto dentro del círculo de número
  photoNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },

  // Imagen de la foto
  photo: {
    width: '100%',
    height: 280,
    backgroundColor: '#EEEEEE',
  },

  // Sección de interpretación 
  interpretationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  
  // Icono de la interpretación
  interpretationIcon: {
    marginTop: 2,
  },
  
  // Texto de la interpretación 
  interpretation: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#757575',
  },

  // Tarjeta de recomendaciones 
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // Header de la tarjeta de recomendaciones
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  
  // Título de las recomendaciones
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },

  // Lista de recomendaciones individuales
  recommendationList: {
    gap: 12,
  },
  
  // Elemento individual de recomendación
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  
  // Punto de viñeta para cada recomendación
  bulletPoint: {
    marginTop: 4,
  },
  
  // Texto de cada recomendación
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#757575',
  },

  // Tarjeta de recomendación final resaltada
  finalRecommendationCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  
  // Header de la recomendación final
  finalRecommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  
  // Título de la recomendación final
  finalRecommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  
  // Texto de la recomendación final
  finalRecommendationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#757575',
  },

  // Espacio al final del scroll
  bottomSpacer: {
    height: 40,
  },

  // Estado de carga inicial
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  
  // Texto del estado de carga
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },

  // Estado cuando no hay datos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F9F9F9',
  },
  
  // Icono de estado vacío
  emptyIcon: {
    marginBottom: 20,
  },
  
  // Título de estado vacío
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  // Subtítulo de estado vacío
  emptySubtitle: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  
  // Botón para volver en estado vacío
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1565C0',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  
  // Texto del botón de estado vacío
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;