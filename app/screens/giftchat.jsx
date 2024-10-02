import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { images } from "../../constants";

const GiftChatScreen = () => {
  const router = useRouter();

  const { userName } = useLocalSearchParams(); // Access bookId from the query parameters;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Support Bot",
          avatar: images.logoSmall,
        },
      },
    ]);
  }, [router, userName]); // Update title when userName changes

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Display the user's name */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#f8f8f8",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{userName}</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1, // ID of the current user (you)
        }}
      />
    </View>
  );
};

export default GiftChatScreen;
