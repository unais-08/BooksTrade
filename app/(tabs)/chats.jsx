import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../constants";
import { SearchInput } from "../../components";
import { router } from "expo-router";
import { fetchUsers } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

// ChatListScreen Component
const ChatListScreen = () => {
  const [users, setUsers] = useState([]);

  const { data: registerUsers } = useAppwrite(fetchUsers);
  useEffect(() => {
    if (registerUsers) {
      setUsers(registerUsers); // Set users when the data is available
    }
  }, [registerUsers]);
  // console.log(users);

  // Render individual chat item
  const renderChatItem = ({ item: user }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() =>
        router.push(
          `/screens/giftchat?userId=${user?.accountId}&username=${user?.username}&avatar=${user?.avatar}`
        )
      }
    >
      {/* User Profile Image */}
      <Image
        source={{ uri: user?.avatar }} // Ensure the correct format
        className="w-12 h-12 rounded-full"
        resizeMode="contain"
      />
      {/* Username */}
      <View className="ml-4">
        <Text className="text-lg font-semibold text-white">
          {user?.username || "UNKNOWN USERS"}
        </Text>
        {/* Placeholder for last message or other info */}
        <Text className="text-sm text-gray-200">Last message preview</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <SearchInput
        title="Search for the User"
        otherStyles=" px-4 rounded-none"
      />
      <FlatList
        data={users}
        renderItem={renderChatItem}
        keyExtractor={(user) => user.accountId}
        showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        initialNumToRender={7} // Render 7 users initially for performance
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
