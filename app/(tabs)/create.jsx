import { useState } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { icons } from "../../constants";
import { createBookPost } from "../../lib/appwrite";
import { CustomeHeader, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    coverImage: null,
    author: "",
    genre: "",
    description: "",
    language: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          coverImage: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      (form.author === "") |
      (form.title === "") |
      !form.coverImage |
      (form.genre === "") |
      (form.description === "")
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createBookPost({
        ...form,
        userId: user.$id,
        ownerName: user.username,
        ownerAvatar: user.avatar,
        language: "English",
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",

        coverImage: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    // my-6 in scrollview
    <SafeAreaView className="bg-gray-50 h-full">
      <CustomeHeader title="Upload Trade" showBackButton={true} />
      <ScrollView className="px-4 my-2 " showsVerticalScrollIndicator={false}>
        <View className="space-y-6">
          {/* Book Basic Information */}
          <View className="space-y-4">
            <FormField
              title="Book Title"
              value={form.title}
              placeholder="Enter full book title"
              handleChangeText={(e) => setForm({ ...form, title: e })}
            />
            <View className="space-y-2">
              <Text className="text-base text-gray-800 font-semibold">
                Book Cover
              </Text>

              <TouchableOpacity
                onPress={() => openPicker("image")}
                className="w-full"
              >
                {form.coverImage ? (
                  <View className="relative">
                    <View className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden">
                      <Image
                        source={{ uri: form.coverImage.uri }}
                        resizeMode="contain" // Change to 'contain' to show the full image
                        className="w-full h-full" // Ensure the image takes the full width and height of the container
                      />
                    </View>
                    <View className="absolute bottom-0 right-0 bg-blue-500 px-4 py-2 rounded-full shadow-md">
                      <Text className="text-white text-xs">Change Cover</Text>
                    </View>
                  </View>
                ) : (
                  <View className="w-full h-52 bg-white rounded-xl border-2 border-dashed border-blue-200 flex justify-center items-center space-y-3 shadow-sm">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-16 h-16 opacity-40"
                    />
                    <Text className="text-base text-blue-600 font-semibold">
                      Upload Book Cover
                    </Text>
                    <Text className="text-xs text-gray-500 text-center px-4">
                      High-quality image recommended (JPG, PNG)
                      {"\n"}
                      Minimum 800x1200 pixels
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <FormField
                  title="Author"
                  value={form.author}
                  placeholder="Book author"
                  handleChangeText={(e) => setForm({ ...form, author: e })}
                />
              </View>
              <View className="flex-1">
                <FormField
                  title="Genre"
                  value={form.genre}
                  placeholder="Book genre"
                  handleChangeText={(e) => setForm({ ...form, genre: e })}
                />
              </View>
            </View>
          </View>

          {/* Book Cover Upload Section */}

          {/* Additional Book Details */}
          {/* <View className="flex-row space-x-4">
            <View className="flex-1">
              <FormField
                title="Language"
                value={form.language}
                placeholder="Book language"
                handleChangeText={(e) => setForm({ ...form, language: e })}
              />
            </View>
            <View className="flex-1">
              <FormField
                title="Publication Year"
                value={form.publicationYear}
                placeholder="Year of publication"
                keyboardType="numeric"
                maxLength={4}
                handleChangeText={(e) =>
                  setForm({ ...form, publicationYear: e })
                }
              />
            </View>
          </View> */}

          {/* Description Field */}
          <View className="space-y-2">
            <Text className="text-base text-gray-800 font-semibold">
              Book Description
            </Text>
            <View className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <TextInput
                value={form.description}
                placeholder="Briefly describe the book..."
                placeholderTextColor="#A1A1AA"
                multiline
                textAlignVertical="top"
                className="p-4 text-base text-gray-800 leading-relaxed"
                style={{
                  minHeight: 60,
                  maxHeight: 250,
                }}
                maxLength={500}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
              {/* i remove form.descriptino.length */}
              {form.description > 0 && (
                <View className="absolute bottom-2 right-4">
                  <Text className="text-xs text-gray-400">
                    {form.description.length}/500
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Submit Button */}
        </View>
        <TouchableOpacity
          onPress={submit}
          disabled={uploading}
          className={`
    mt-8 
    bg-blue-600 
    rounded-xl 
    shadow-md
    py-3 
    px-4
    flex-row 
    items-center 
    justify-center 
    ${uploading ? "opacity-50" : "active:bg-blue-700"}
  `}
          style={{
            minHeight: 50,
            maxHeight: 55,
          }}
        >
          <View className="flex-row items-center justify-center space-x-2">
            {uploading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="cloud-upload-outline" size={20} color="white" />
            )}
            <Text
              className="text-white font-semibold text-base text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {uploading ? "Publishing..." : "Submit & Publish Book"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
