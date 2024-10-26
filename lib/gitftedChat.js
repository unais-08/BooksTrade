import { InputToolbar, Composer, Send, Bubble } from "react-native-gifted-chat";
import { View, Dimensions } from "react-native";
import { icons, images } from "../constants";
import { Image } from "react-native-animatable";

export const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 0,
        padding: 8, // Add padding around the input
        backgroundColor: "#f0f0f0", // Light gray background like WhatsApp
        marginBottom: 8, // Add some margin to lift it from the bottom
        borderRadius: 20, // Round the whole toolbar
      }}
    />
  );
};

export const renderComposer = (props) => {
  return (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: "#ffffff", // White background for input
        paddingHorizontal: 12, // Add padding inside the text input
        paddingVertical: 8,
        borderRadius: 20, // Rounded input like WhatsApp
        marginRight: 8, // Add some space between the input and the send button
        borderWidth: 1,
        borderColor: "#ddd", // Light border
      }}
    />
  );
};

export const renderSend = (props) => {
  return (
    <Send {...props}>
      <View className="bg-blue-500 p-2 rounded-full">
        <Image source={icons.sendBtn} style={{ width: 30, height: 20 }} />
      </View>
    </Send>
  );
};

const { width: screenWidth } = Dimensions.get("window");

export const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: "#E5E4E2", // Color for receiver messages
          maxWidth: screenWidth * 0.7,
          minWidth: screenWidth * 0.2,
          borderRadius: 15,
          padding: 8,
          marginVertical: 5,
        },
        right: {
          backgroundColor: "#0084ff", // Color for sender messages
          maxWidth: screenWidth * 0.7,
          minWidth: screenWidth * 0.2,
          borderRadius: 15,
          padding: 8,
          marginVertical: 5,
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
