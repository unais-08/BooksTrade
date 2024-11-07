import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  return (
    <View
    // focus:border-secondary ${otherStyles} border-gray-50
      className={` flex flex-row items-center space-x-4 w-full h-12 px-4 bg-white rounded-md border border-gray-300 `}
    >
      <TextInput
        className="mt-0.5 text-gray-700 text-base flex-1 font-pregular"
        //  className=" text-gray-700 bg-gray-50 text-base"
        value={query}
        placeholder={`${title}`}
        placeholderTextColor="#9CA3AF"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "missing query",
              "please input something to search"
            );
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
