import { useState } from "react";
import * as Animatable from "react-native-animatable";
import { FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <ImageBackground
        source={{
          uri: item.coverImage,
        }}
        className="w-40 h-60 rounded-[15px] my-5 overflow-hidden shadow-lg shadow-black/40"
        resizeMode="cover"
      />
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/screens/details?bookId=${item.$id}`)}
        >
          <TrendingItem activeItem={activeItem} item={item} />
        </TouchableOpacity>
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
