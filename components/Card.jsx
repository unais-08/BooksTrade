import React, { useState } from "react";
import { View, Text, Image } from "react-native";

const Card = ({
  title,
  author,
  coverImage,
  genre,
  description,
  language,
  username,
  avatar,
}) => {
  return (
    // Define the truncated version of the text

    <View className="flex-1 items-center justify-center mt-10">
      {/* Main Card Body */}

      {/* Cover Image */}
      <View className="flex items-center justify-center  ">
        {coverImage && (
          <Image
            source={{ uri: coverImage }}
            className="w-60 h-80 max-w-full max-h-80 rounded-lg mt-2"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Card Content */}
      <View className="p-4">
        {title && (
          <Text className="text-2xl font-pmedium text-center capitalize text-gray-500 tracking-wider">
            {title}
          </Text>
        )}
        {author && (
          <Text className="text-sm font-pmedium text-gray-600 capitalize mt-2">
            Author: {author}
          </Text>
        )}
        {genre && (
          <Text className="text-sm font-pmedium text-gray-600">
            Genre: {genre}
          </Text>
        )}
        {language && (
          <Text className="text-sm font-pmedium text-gray-600">
            Language: {language}
          </Text>
        )}
        {username && (
          <Text className="text-sm font-pmedium text-gray-600">
            Uploaded By: {username}
          </Text>
        )}

        {/* Description */}

        {description && (
          <>
            <Text className="text-sm font-pmedium text-gray-600 mt-1">
              Description:
            </Text>
            <Text className="text-sm font-plight text-gray-600 text-justify mt-2">
              {description} Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Voluptatem iste quod nihil natus iure perspiciatis in nam
              explicabo, doloremque sequi... Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Sint eius fugit perferendis cum sed
              accusantium modi natus, itaque debitis dolorem, rem libero omnis
              totam vitae odit. Cupiditate necessitatibus, vitae repellat saepe
              est eligendi, ab assumenda quisquam eaque provident maxime
              consectetur, porro fugiat dolore eos officiis praesentium beatae
              aperiam. Ipsa, assumenda accusamus neque repellendus sed dolor!
              Eaque est impedit illo esse cumque consectetur? Nihil nobis dicta
              accusantium quasi praesentium. Odio eius necessitatibus officiis
              explicabo minus veniam repudiandae autem reprehenderit. Ex at
              architecto soluta itaque repellat quisquam, libero dolorum ab,
              nobis dolorem tenetur harum perferendis iste rem nam, animi
              molestias sint autem. Aliquam error minus veniam vero excepturi
              quibusdam quas provident ipsa optio nihil ex sequi consectetur
              illo, sapiente molestias consequatur tempore iure, iusto nobis
              temporibus! Id officia tempore voluptatum repellendus ea nemo
              quisquam voluptates reiciendis iusto ad commodi enim quidem ipsam
              a, nesciunt natus sit odit distinctio cum doloribus consectetur.
              Facilis iste dolores, ullam magni minima voluptatem exercitationem
              odit ipsa sed perferendis? Eligendi
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Card;
