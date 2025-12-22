import { styles } from '@/app/styles/cameraStyle';
import { SafeArea } from '@/components/ui/safe-area';
import { useAuth } from '@/hooks/useAuth';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    router.push("/home");
  };

  // Renderizado de la pantalla
  return (
    <SafeArea>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goHome}>
          <Ionicons name="arrow-back" size={28} color="#1565C0" />
        </TouchableOpacity>

        <Text style={styles.title}>Selecciona una opción</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <FontAwesome5 name="camera" size={20} color="white" />
            <Text style={styles.buttonText}>Abrir cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSelectFromGallery}>
            <FontAwesome5 name="image" size={20} color="white" />
            <Text style={styles.buttonText}>Seleccionar de galería</Text>
          </TouchableOpacity>
        </View>

        {selectedPhoto && (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Image source={{ uri: selectedPhoto }} style={styles.imagePreview} />
            {isLoading ? (
              <ActivityIndicator size="large" color="#1565C0" style={styles.loader} />
            ) : (
              <>
                <Text style={styles.interpretationText}>{interpretation}</Text>
                  
                  <Text style={styles.mealTypeLabel}>Seleccione el tipo de comida</Text>
                {/* Selector de tipo de comida - CAMBIADO A BOTONES */}
                <View style={styles.mealTypeContainer}>
                  {['desayuno', 'almuerzo', 'cena', 'snack', 'comida_extra', 'postre'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.mealTypeButton,
                        mealType === item && styles.mealTypeButtonSelected
                      ]}
                      onPress={() => setMealType(item)}
                    >
                      <Text style={[
                        styles.mealTypeText,
                        mealType === item && styles.mealTypeTextSelected
                      ]}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={savePhoto} disabled={isLoading}>
                  <MaterialIcons name="save" size={20} color="white" />
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}
      </View>
    </SafeArea>
  );
}