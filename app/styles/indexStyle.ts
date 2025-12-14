import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Contenedor principal centrado
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F9F9F9',
  },
  
  // Logo de la aplicación
  logo: {
    width: 200,
    height: 200,
    marginBottom: 1,
  },
  
  // Título principal
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E7D32', 
    marginBottom: 2,
  },
  
  // Subtítulo
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0', 
    marginBottom: 15,
  },
  
  // Lema descriptivo
  tagline: {
    fontSize: 16,
    color: '#757575', 
    marginBottom: 40,
    textAlign: 'center',
  },
  
  // Contenedor de campo de entrada
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  
  // Etiqueta de campo
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121', 
    marginBottom: 8,
  },
  
  // Campo de texto
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    color: '#212121',
  },
  
  // Botón principal
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 16,
    backgroundColor: '#2E7D32', 
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Botón deshabilitado
  buttonDisabled: {
    backgroundColor: '#A5D6A7', 
  },
  
  // Texto del botón
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  
  // Botón de registro (estilo texto)
  registerButton: {
    marginTop: 25,
    padding: 10,
  },
  
  // Texto "¿No tienes cuenta?"
  noAccountText: {
    color: '#757575', 
    fontSize: 15,
  },
  
  // Enlace "Regístrate"
  registerTextLink: {
    color: '#1565C0', 
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '600',
  },
});

// Exportación predeterminada
export default styles;