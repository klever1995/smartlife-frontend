import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Header de navegación
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  
  // Título del header
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  
  // Botón para volver atrás
  backButton: {
    padding: 8,
    borderRadius: 8,
  },

  // Contenedor principal del scroll view
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },

  // Tarjeta para cada día con fotos
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // Encabezado de la tarjeta (fecha + botón eliminar)
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Contenedor de fecha con icono
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // Etiqueta de fecha
  dateLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212121',
  },

  // Botón para eliminar todo un día
  deleteButton: {
    backgroundColor: '#FF5252',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Fila de miniaturas de fotos (máximo 3)
  photosRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  
  // Contenedor de cada miniatura
  photoContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  
  // Miniatura de foto
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    marginBottom: 4,
  },
  
  // Texto del tipo de comida
  mealType: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },

  // Sección de estadísticas del día
  statsContainer: {
    marginBottom: 12,
  },
  
  // Contador de fotos
  photoCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
    marginBottom: 2,
  },
  
  // Lista de tipos de comida
  mealTypes: {
    fontSize: 13,
    color: '#757575',
  },

  // Contenedor de recomendación IA (si existe)
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  
  // Texto de la recomendación IA
  recommendationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#757575',
  },

  // Botón para ver detalle completo del día
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    borderRadius: 10,
  },
  
  // Texto del botón de detalle
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Estado cuando no hay datos en el historial
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
  
  // Botón para volver al inicio
  emptyButton: {
    backgroundColor: '#2E7D32',
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

  // Overlay durante el proceso de eliminación
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  // Modal de confirmación durante eliminación
  deleteModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  
  // Texto dentro del modal de eliminación
  deleteModalText: {
    marginTop: 12,
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
});

export default styles;