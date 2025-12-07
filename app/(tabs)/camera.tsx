import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

// URL base desde variable de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CameraScreen() {
  const { user } = useAuth();
  const username = user?.username || "";
  const router = useRouter();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mealType, setMealType] = useState<string>("desayuno");

  // CORRECCIÓN: useFocusEffect para manejar back solo cuando esta pantalla tiene foco
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/(tabs)/home");
        return true; // Previene el comportamiento por defecto
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup correcto
      return () => subscription.remove();
    }, [])
  );

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
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await res.json();
      setInterpretation(data.interpretation || "No se obtuvo interpretación");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.ok) throw new Error("Error al guardar la foto");

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

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedPhoto(uri);
      await interpretPhoto(uri);
    }
  };

  const handleSelectFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedPhoto(uri);
      await interpretPhoto(uri);
    }
  };

  const goHome = () => {
    router.push("/(tabs)/home");
  };

  return (
    <ThemedView style={cameraStyles.container}>
      {/* Flecha superior izquierda */}
      <TouchableOpacity style={cameraStyles.backButton} onPress={goHome}>
        <Ionicons name="arrow-back" size={28} color="#0077b6" />
      </TouchableOpacity>

      <ThemedText type="title">Selecciona una opción</ThemedText>

      <View style={cameraStyles.buttonsContainer}>
        <TouchableOpacity style={cameraStyles.button} onPress={handleTakePhoto}>
          <ThemedText type="defaultSemiBold">📸 Abrir cámara</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={cameraStyles.button} onPress={handleSelectFromGallery}>
          <ThemedText type="defaultSemiBold">🖼️ Seleccionar de galería</ThemedText>
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

              <TouchableOpacity style={[cameraStyles.button, { marginTop: 15 }]} onPress={savePhoto}>
                <ThemedText type="defaultSemiBold">💾 Guardar</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const cameraStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  buttonsContainer: { marginTop: 30, width: '100%' },
  button: {
    backgroundColor: "#0077b6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
  },
});