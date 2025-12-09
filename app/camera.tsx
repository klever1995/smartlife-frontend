// Imports principales
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeArea } from '@/components/ui/safe-area';
import { sharedButtonStyles } from '@/constants/buttonStyles';
import { useAuth } from '@/hooks/useAuth';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CameraScreen() {

  // Datos de usuario y estados del componente
  const { user } = useAuth();
  const username = user?.username || "";
  const router = useRouter();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mealType, setMealType] = useState<string>("desayuno");

  // Btn físico de back a home
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/home");
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // Interpretar foto
  const interpretPhoto = async (uri: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const filename = uri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("file", { uri, name: filename, type } as any);

      const res = await fetch(`${API_URL}/photos/interpret`, {
        method: "POST",
        body: formData,
        // quitar Content-Type, fetch lo maneja automáticamente
      });

      const data = await res.json();
      setInterpretation(data.interpretation || "No se obtuvo interpretación");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar foto e interpretación
  const savePhoto = async () => {
    if (!selectedPhoto || !interpretation) {
      Alert.alert("Error", "No hay foto o interpretación disponible");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      const filename = selectedPhoto.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", { uri: selectedPhoto, name: filename, type } as any);
      formData.append("username", username);
      formData.append("meal_type", mealType);
      formData.append("interpretation", interpretation);

      const res = await fetch(`${API_URL}/photos/upload`, {
        method: "POST",
        body: formData,
        // quitar Content-Type, fetch lo maneja automáticamente
      });

      if (!res.ok) throw new Error("Error al guardar la foto");
      await AsyncStorage.setItem('lastUpdate', Date.now().toString());
      Alert.alert("Éxito", "Foto guardada correctamente");

      setSelectedPhoto(null);
      setInterpretation("");
      setMealType("desayuno");

    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir cámara
const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // correcto para versiones <14
    quality: 1,
  });
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setSelectedPhoto(uri);
    await interpretPhoto(uri);
  }
};

// Seleccionar de galería
const handleSelectFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // correcto para versiones <14
    quality: 1,
  });
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setSelectedPhoto(uri);
    await interpretPhoto(uri);
  }
};


  const goHome = () => {
    router.push("/home");
  };

  // Renderizado de la apantalla
  return (
    <SafeArea>
      <ThemedView style={cameraStyles.container}>
        <TouchableOpacity style={cameraStyles.backButton} onPress={goHome}>
          <Ionicons name="arrow-back" size={28} color="#0077b6" />
        </TouchableOpacity>

        <ThemedText type="title">Selecciona una opción</ThemedText>

        <View style={cameraStyles.buttonsContainer}>
          <TouchableOpacity style={sharedButtonStyles.button} onPress={handleTakePhoto}>
            <FontAwesome5 name="camera" size={20} color="white" />
            <ThemedText type="defaultSemiBold" style={sharedButtonStyles.buttonTextMargin}>Abrir cámara</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={sharedButtonStyles.button} onPress={handleSelectFromGallery}>
            <FontAwesome5 name="image" size={20} color="white" />
            <ThemedText type="defaultSemiBold" style={sharedButtonStyles.buttonTextMargin}>Seleccionar de galería</ThemedText>
          </TouchableOpacity>
        </View>

        {selectedPhoto && (
          <ScrollView style={{ marginTop: 20 }}>
            <Image source={{ uri: selectedPhoto }} style={{ width: 300, height: 300, alignSelf: 'center', borderRadius: 10 }} />
            {isLoading ? (
              <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 20 }} />
            ) : (
              <>
                <ThemedText type="defaultSemiBold" style={{ marginTop: 10, textAlign: 'center' }}>
                  {interpretation}
                </ThemedText>

                <Picker
                  selectedValue={mealType}
                  onValueChange={(itemValue) => setMealType(itemValue)}
                  style={{ marginTop: 15, marginHorizontal: 50, backgroundColor: 'white', color: '#000' }}
                >
                  <Picker.Item label="Desayuno" value="desayuno" />
                  <Picker.Item label="Almuerzo" value="almuerzo" />
                  <Picker.Item label="Cena" value="cena" />
                  <Picker.Item label="Snack" value="snack" />
                  <Picker.Item label="Comida extra" value="comida_extra" />
                  <Picker.Item label="Postre" value="postre" />
                </Picker>

                <TouchableOpacity style={[sharedButtonStyles.button, { marginTop: 15 }]} onPress={savePhoto}>
                  <MaterialIcons name="save" size={20} color="white" />
                  <ThemedText type="defaultSemiBold" style={sharedButtonStyles.buttonTextMargin}>Guardar</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}
      </ThemedView>
    </SafeArea>
  );
}

// Estilos de la pantalla
const cameraStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
  },
  buttonsContainer: { 
    marginTop: 30, 
    width: '100%', 
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
  },
});
