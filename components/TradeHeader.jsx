import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid"; // Assumes you're using Heroicons for icons
import { useNavigation } from "@react-navigation/native";

const TradeHeader = ({ title = "Trade Requests", showBackButton = false }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between bg-blue-600 p-4 shadow-lg">
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
      )}

      <Text className="flex-1 text-xl font-semibold text-white text-center">
        {title}
      </Text>

      {/* Placeholder to align title centrally if no back button */}
      {showBackButton && <View className="w-8" />}
    </View>
  );
};

export default TradeHeader;
