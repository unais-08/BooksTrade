import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../constants";
import { SearchInput } from "../../components";
import { router } from "expo-router";

// ChatListScreen Component
const ChatListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = [
        { id: "1", name: "John Doe", dp: "https://example.com/johndoe.jpg" },
        {
          id: "2",
          name: "Jane Smith",
          dp: "https://example.com/janesmith.jpg",
        },
        { id: "3", name: "Alice Johnson", dp: "https://example.com/alice.jpg" },
        { id: "4", name: "Bob Brown", dp: "https://example.com/bobbrown.jpg" },
        {
          id: "5",
          name: "Charlie Davis",
          dp: "https://example.com/charliedavis.jpg",
        },
        {
          id: "6",
          name: "Emily White",
          dp: "https://example.com/emilywhite.jpg",
        },
        {
          id: "7",
          name: "David Black",
          dp: "https://example.com/davidblack.jpg",
        },
        {
          id: "8",
          name: "Frank Green",
          dp: "https://example.com/frankgreen.jpg",
        },
        { id: "9", name: "Grace Lee", dp: "https://example.com/gracelee.jpg" },
        {
          id: "10",
          name: "Helen Miller",
          dp: "https://example.com/helenmiller.jpg",
        },
      ];
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, []);

  // Render individual chat item
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => router.push(`/screens/giftchat?userName=${item.name}`)}
    >
      {/* User Profile Image */}
      <Image
        source={images.logo}
        className="w-12 h-12 rounded-full"
        resizeMode="contain"
      />
      {/* Username */}
      <View className="ml-4">
        <Text className="text-lg font-semibold text-white">{item.name}</Text>
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
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        initialNumToRender={7} // Render 7 users initially for performance
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
