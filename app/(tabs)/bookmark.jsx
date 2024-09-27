import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const bookmark = () => {
  return (
    <SafeAreaView>
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl">BookMarks (tabs)</Text>
      </View>
    </SafeAreaView>
  );
};

export default bookmark;
