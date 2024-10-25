import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  subscribeToMessages,
  sendMessage,
  getMessagesForChat,
} from "../../lib/appwrite"; // Assuming appwrite.js is your Appwrite file
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";
import ChatHeader from "../../components/ChatHeader";

import { KeyboardAvoidingView, Platform } from "react-native";
import {
  renderBubble,
  renderComposer,
  renderInputToolbar,
  renderSend,
} from "../../lib/gitftedChat";

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

  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessage) => {
      if (newMessage.chatID === chatID) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg._id === newMessage.$id
          );

          if (messageExists) {
            console.warn(
              "Duplicate message detected, skipping:",
              newMessage.$id
            );
            return prevMessages; // Skip adding duplicate
          }

          return GiftedChat.append(prevMessages, [
            {
              _id: newMessage.$id,
              text: newMessage.messageText,
              createdAt: new Date(newMessage.createdAt),
              user: {
                _id: newMessage.senderID,
                name: newMessage.senderName,
                avatar:
                  newMessage.senderID === loggedUserId
                    ? loggedUserAvatar
                    : receiverAvatar,
              },
            },
          ]);
        });
      }
    });

    // Cleanup the subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [chatID, loggedUserId, loggedUserAvatar, receiverAvatar]); //ye  uncomment karna hai

  const onSend = useCallback(
    async (newMessages = []) => {
      const newMessage = newMessages[0]; // Get the first message sent
      await sendMessage({
        chatID: chatID,
        user: { _id: loggedUserId, name: loggedUserName },
        receiverID: receiverID,
        text: newMessage.text,
      });

      // Don't manually append; rely on real-time updates
    },
    [chatID, loggedUserId, loggedUserName, receiverID]
  );
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined} // Adjust keyboard for iOS
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Offset to prevent hiding content
      >
        <ChatHeader
          receiverName={receiverName}
          receiverAvatar={receiverAvatar}
        />
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: loggedUserId,
            name: loggedUserName,
            avatar: loggedUserAvatar,
          }}
          renderBubble={renderBubble}
          renderAvatar={() => null}
          keyboardShouldPersistTaps="never" // Dismiss keyboard when tapping outside
          minInputToolbarHeight={60} // Minimum height for the input toolbar
          alwaysShowSend // Always show send button
          bottomOffset={Platform.OS === "android" ? 0 : 20} // Adjust bottom offset for input
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
        />
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatScreen;
