import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  View,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import {
  generalOnRefresh,
  getConnectedUsers,
  getUsersByIds,
  subscribeToMessages,
} from "../../lib/appwrite"; // Function to get connected users
import { useGlobalContext } from "../../context/GlobalProvider"; // Global context for user info
import { useRouter } from "expo-router"; // Router for navigation
import { icons, images } from "../../constants";

const ChatListScreen = () => {
  const { user } = useGlobalContext(); // Get logged-in user info from global context
  if (!user) return;
  const router = useRouter(); // Get router for navigation
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    await generalOnRefresh(fetchConnectedUsers);
  };

  const fetchConnectedUsers = async () => {
    try {
      const initialUsers = await getConnectedUsers(user?.$id); // userId from context
      setUsers(initialUsers);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  useEffect(() => {
    fetchConnectedUsers();

    const unsubscribe = subscribeToMessages((newMessage) => {
      // Check if the sender or receiver is a new user
      const newUser =
        newMessage.senderID !== user?.$id
          ? newMessage.senderID
          : newMessage.receiverID;

      // Avoid fetching the same user multiple times
      if (!users.some((u) => u.$id === newUser)) {
        getUsersByIds([newUser]).then((newUserDetails) => {
          setUsers((prevUsers) => [...prevUsers, ...newUserDetails]);
        });
      }
    });

    return () => {
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, [user?.$id]); // Only depend on user ID
  // Render individual chat item

  const defaultUser = {
    $id: 5665454544, // Unique ID for the default user
    username: "Default User",
    avatar: `https://cloud.appwrite.io/v1/avatars/initials?name=Default User&project=66f64c2a0026e2fbaefc`, // URL for the default avatar
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() =>
        router.push(
          `/screens/chatScreen?userId=${item.$id}&username=${
            item.username
          }&avatar=${encodeURIComponent(item.avatar)}`
        )
      }
    >
      {/* User Profile Image */}
      <Image
        source={{ uri: item?.avatar }} // Ensure the correct format
        className="w-12 h-12 rounded-full"
        resizeMode="contain"
      />
      {/* Username */}
      <View className="ml-4">
        <Text className="text-lg font-semibold text-white">
          {item?.username || "UNKNOWN USER"}
        </Text>
        {/* Placeholder for last message or other info */}
        <Text className="text-sm text-gray-200">Last message preview</Text>
      </View>
    </TouchableOpacity>
  );
  const usersToDisplay = users.length > 0 ? users : [defaultUser];
  return (
    <SafeAreaView className="flex-1 bg-primary px-4 py-6">
      <FlatList
        data={usersToDisplay} // Use the usersToDisplay state
        renderItem={renderChatItem}
        keyExtractor={(item) => item.$id} // Ensure unique key
        showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        initialNumToRender={7} // Render 7 users initially for performance
        contentContainerStyle={{ paddingBottom: 20 }} // Add space at the bottom
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
