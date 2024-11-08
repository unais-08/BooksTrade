import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "../constants";
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "",
  multiline = false,
  secureTextEntry = false,
  leftIcon = null,
  error = "",
  clearable = false,
  keyboardType = "default",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {title && (
        <Text className="text-[15px] text-gray-700 font-medium">{title}</Text>
      )}

      <View
        className={`w-full h-14 px-4 bg-white rounded-xl border 
        flex flex-row items-center shadow-sm ${
          error ? "border-red-400" : "border-gray-200 focus:border-blue-500"
        }`}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Image
            source={leftIcon}
            className="w-5 h-5 mr-3 opacity-60"
            resizeMode="contain"
          />
        )}

        <TextInput
          className="flex-1 text-gray-900 font-normal text-[14px]"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          multiline={multiline}
          keyboardType={keyboardType}
          numberOfLines={multiline ? 4 : 1}
          style={{
            paddingVertical: multiline ? 10 : 0,
            height: multiline ? 100 : "auto",
          }}
          {...props}
        />

        {/* Password Toggle */}
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-5 h-5 opacity-70"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Clearable Input */}
        {value && clearable && (
          <TouchableOpacity
            onPress={() => handleChangeText("")}
            className="ml-2"
          >
            <Image
              source={icons.close}
              className="w-4 h-4 opacity-50"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && error.trim() !== "" && (
        <View className="flex flex-row items-center space-x-2 mt-1">
          <Image
            source={icons.warning}
            className="w-4 h-4 tintColor-red-500"
            resizeMode="contain"
          />
          <Text className="text-[12px] text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default FormField;
