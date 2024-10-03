import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  subscribeToMessages,
  sendMessage,
  getMessagesForChat,
} from "../../lib/appwrite"; // Assuming appwrite.js is your Appwrite file
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import { View, Image, Text } from "react-native-animatable";

const ChatScreen = () => {
  const {
    userId: receiverID,
    username: receiverName,
    avatar: receiverAvatar,
  } = useLocalSearchParams();
  const { user } = useGlobalContext(); // Assuming global context gives you logged-in user info
  const {
    username: loggedUserName,
    avatar: loggedUserAvatar,
    $id: loggedUserId,
  } = user;

  const [messages, setMessages] = useState([]);

  const chatID =
    loggedUserId < receiverID
      ? `${loggedUserId}_${receiverID}`
      : `${receiverID}_${loggedUserId}`;

  // Fetch initial messages when the component loads
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const fetchedMessages = await getMessagesForChat(chatID);
        const formattedMessages = fetchedMessages.map((msg) => ({
          _id: msg.$id,
          text: msg.messageText,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.senderID,
            name: msg.senderName,
            avatar:
              msg.senderID === loggedUserId ? loggedUserAvatar : receiverAvatar,
          },
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
  }, [chatID]);

  // Subscribe to real-time messages when the component mounts
  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessage) => {
      if (newMessage.chatID === chatID) {
        // Append the new message to the message list
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, [
            {
              _id: newMessage.$id,
              text: newMessage.messageText,
              createdAt: new Date(newMessage.createdAt),
              user: {
                _id: newMessage.senderID,
                name: newMessage.senderName,
                avatar:
                  // newMessage.senderID === loggedUserId
                  //   ? loggedUserAvatar
                  //   : receiverAvatar,
                  loggedUserAvatar,
              },
            },
          ])
        );
      }
    });

    // Cleanup the subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [chatID, loggedUserId, loggedUserAvatar, receiverAvatar]);

  // Handle sending a new message
  const onSend = useCallback(
    async (newMessages = []) => {
      const newMessage = newMessages[0]; // Get the first message sent
      await sendMessage({
        chatID: chatID,
        user: { _id: loggedUserId, name: loggedUserName },
        receiverID: receiverID,
        text: newMessage.text,
      });

      // Only append if the message was successfully sent
      // setMessages((prevMessages) =>
      //   GiftedChat.append(prevMessages, newMessages)
      // );
    },
    [chatID, loggedUserId, loggedUserName, receiverID]
  );
  const renderAvatar = (props) => {
    return (
      <Image
        source={{ uri: props.currentMessage.user.avatar }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20, // Make it circular
          text: "black",
        }}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0",
          },
          right: {
            backgroundColor: "#0084ff",
          },
        }}
        textStyle={{
          left: {
            color: "#000",
          },
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };
  const RenderHeader = () => (
    <View className="flex flex-row items-center p-4 bg-gray-100 border-b border-gray-300">
      <Image
        source={{ uri: receiverAvatar }}
        className="w-10 h-10 rounded-full mr-2"
      />
      <Text className="text-lg font-bold text-black">{receiverName}</Text>
    </View>
  );
  return (
    <>
      <RenderHeader />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: loggedUserId,
          name: loggedUserName,
          avatar: loggedUserAvatar,
        }}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar} // Pass the custom avatar renderer
      />
    </>
  );
};

export default ChatScreen;
