import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ReadMoreLess = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track text expansion

  // Toggle function to expand/collapse text
  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  // Define the truncated version of the text
  const truncatedText =
    description.length > 100
      ? `${description.substring(0, 100)}...`
      : description;

  return (
    <View>
      <Text className="text-sm font-plight text-gray-600 text-justify mt-2">
        {isExpanded ? description : truncatedText}
      </Text>
      <TouchableOpacity onPress={toggleReadMore}>
        <Text className="text-blue-500">
          {isExpanded ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default ReadMoreLess;
