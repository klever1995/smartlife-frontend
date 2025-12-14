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

  // Contenedor del selector de tipo de comida
  pickerContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },

  // Selector de tipo de comida
  picker: {
    width: '100%',
    height: 50,
    color: '#212121', 
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