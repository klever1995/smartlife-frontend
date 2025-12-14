import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: { 
    flex: 1, 
    backgroundColor: "#F9F9F9", 
    padding: 20, 
  },

  // Encabezado con saludo y botón de logout
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 5, 
  },

  // Texto de saludo al usuario
  header: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: '#2E7D32', 
  },

  // Fecha actual
  subHeader: { 
    fontSize: 16, 
    marginBottom: 20,
    color: '#757575', 
  },

  // Contenedor de botones principales
  buttonsContainer: { 
    marginTop: 20, 
    gap: 16,
  },

  // Botones secundario (Subir foto, Ver historial)
  button: {
    backgroundColor: '#1565C0', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Botón primario (Generar recomendación)
  buttonSpecial: {
    backgroundColor: '#2E7D32', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Botón en estado deshabilitado
  buttonDisabled: {
    backgroundColor: '#A5D6A7', 
  },

  // Texto de los botones
  buttonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "600",
    marginLeft: 12,
  },

  // Recordatorio para el usuario
  reminder: { 
    marginTop: 30, 
    fontSize: 16, 
    fontStyle: "italic",
    color: '#757575', 
    textAlign: 'center',
  },

  // Botón de cerrar sesión
  logoutButton: {
    backgroundColor: '#D32F2F', 
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  // Card para mostrar la última recomendación
  lastRecContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Título de la card de recomendación
  lastRecTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 12,
    color: '#1565C0',
  },

  // Texto de la recomendación
  lastRecText: { 
    fontSize: 15, 
    color: "#212121", 
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default styles;