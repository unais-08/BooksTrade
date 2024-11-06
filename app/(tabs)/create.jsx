import { useState } from "react";
import { router } from "expo-router";
// import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { icons } from "../../constants";
import { createBookPost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
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
        ownerName:user.username,
        ownerAvatar:user.avatar
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
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Book for Trade
        </Text>
        <FormField
          title="Book Title"
          value={form.title}
          placeholder="Name of the Book..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        {/* Upload Image for the Book */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Book Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.coverImage ? (
              <Image
                source={{ uri: form.coverImage.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="Author"
          value={form.author}
          placeholder="Author of the Book...."
          handleChangeText={(e) => setForm({ ...form, author: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Genre"
          value={form.genre}
          placeholder="Genre of the Book...."
          handleChangeText={(e) => setForm({ ...form, genre: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Description"
          value={form.description}
          placeholder="Description of the Book...."
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Language"
          value={form.language}
          placeholder="Language of the Book...."
          handleChangeText={(e) => setForm({ ...form, language: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
