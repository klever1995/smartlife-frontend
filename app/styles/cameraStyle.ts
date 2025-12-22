import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal centrado
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#F9F9F9', 
  },

  // Botón para volver atrás 
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Título principal de la pantalla
  title: { 
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 30,
    color: '#2E7D32', 
    textAlign: 'center',
  },

  // Contenedor para botones de acción (cámara/galería)
  buttonsContainer: { 
    marginTop: 10, 
    width: '100%', 
    gap: 16,
  },

  // Botones secundarios (Abrir cámara, Abrir galería)
  button: {
    backgroundColor: '#1565C0', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Texto dentro de los botones
  buttonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "600",
    marginLeft: 12,
  },

  // Contenedor del scroll 
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },

  // Vista previa de la imagen seleccionada
  imagePreview: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },

  // Indicador de carga durante procesamiento
  loader: {
    marginTop: 30,
  },

  // Texto de interpretación 
  interpretationText: {
    marginTop: 20,
    fontSize: 16,
    color: '#212121', 
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Contenedor de botones de tipo de comida
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    gap: 8,
  },

    // Texto de etiqueta para tipo de comida
  mealTypeLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginHorizontal: 20,
  },

  // Icono del tipo de comida
  mealTypeIcon: {
  width: 24,
  height: 24,
  marginBottom: 4,   
},

  // Botón individual de tipo de comida
  mealTypeButton: {
  flexDirection: 'column',    
  alignItems: 'center',      
  justifyContent: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: '#F0F0F0',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#E0E0E0',
},

  // Botón seleccionado
  mealTypeButtonSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  // Texto del botón
  mealTypeText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },

  // Texto del botón seleccionado
  mealTypeTextSelected: {
    color: 'white',
    fontWeight: '600',
  },

  // Botón primario (Guardar interpretación)
  saveButton: {
    backgroundColor: '#2E7D32', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 25,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default styles;