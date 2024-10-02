import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SingleChatScreen = ({ route }) => {
//   const { userId, userName } = route.params; // Assuming you pass user details via route
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey! How are you?", sender: "other" },
    { id: "2", text: "I’m good! How about you?", sender: "self" },
    { id: "3", text: "Doing great, thanks!", sender: "other" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Function to handle sending a message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        sender: "self", // You are the sender
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  // Render individual message
  const renderMessage = ({ item }) => (
    <View
      className={`flex-row my-2 ${
        item.sender === "self" ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`p-3 max-w-[70%] rounded-lg ${
          item.sender === "self" ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <Text
          className={`${item.sender === "self" ? "text-white" : "text-black"}`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Message List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        inverted // To display latest messages at the bottom
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90} // Offset for iOS to handle keyboard over input
        className="border-t border-gray-200 p-3 flex-row items-center"
      >
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 p-3 rounded-full"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-3 bg-blue-500 p-3 rounded-full"
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SingleChatScreen;
