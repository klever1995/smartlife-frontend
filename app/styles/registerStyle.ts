import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // KeyboardAvoidingView
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  // Contenedor del ScrollView
  scrollContainer: {
    flexGrow: 1,
  },

  // Contenedor principal
  container: { 
    padding: 25, 
    justifyContent: "center",
    backgroundColor: '#F9F9F9',
  },

  // Título general
  title: { 
    fontSize: 32,
    fontWeight: "800", 
    textAlign: "center", 
    marginBottom: 30,
    color: '#2E7D32', // Verde primario
  },

  // Cuadros de texto
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 20,
    fontSize: 16,
    color: '#212121', // Texto principal
  },

  // Etiquetas
  label: { 
    fontSize: 16,
    fontWeight: "600", 
    marginBottom: 8, 
    marginTop: 10,
    color: '#212121', // Texto principal
  },

  // Contenedor horizontal
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 20, 
  },

  // Btn + y -
  stepButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#1565C0", // Azul secundario
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Texto Btn + y -
  stepText: { 
    color: "#FFFFFF", 
    fontSize: 24, 
    fontWeight: "600", 
  },

  // Valor entre botones
  valueText: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: '#2E7D32', // Verde primario
  },

  // Btn selector de fecha
  dateButton: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 20,
  },

  // Texto fecha
  dateText: { 
    fontSize: 16,
    color: '#212121', // Texto principal
    textAlign: 'center',
  },

  // Btn guardar
  button: { 
    backgroundColor: "#2E7D32", // Verde primario
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  
  // Texto btn principal
  buttonText: { 
    color: "#FFFFFF", 
    fontWeight: "700", 
    fontSize: 17, 
  },

  // Btn regresar
  backButton: { 
    marginTop: 25, 
    alignItems: "center", 
    padding: 12,
  },

  // Texto Btn regresar
  backText: { 
    color: "#1565C0", // Azul secundario
    textDecorationLine: "underline", 
    fontSize: 16,
    fontWeight: "600",
  },
});

export const pickerStyles = {
  // Estilo del input para iOS 
  inputIOS: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 20,
    fontSize: 16,
    color: '#212121', // Texto principal
  },

  // Estilo del input para android
  inputAndroid: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginBottom: 20,
    fontSize: 16,
    color: '#212121', // Texto principal
  },
};

export default styles; 