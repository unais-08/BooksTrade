import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton } from "../../components";
const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  return (
    <SafeAreaView>
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl">Profile (tabs)</Text>
        <CustomButton
          title="Logout"
          handlePress={logout}
          containerStyles="mt-7 w-[150px]"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
