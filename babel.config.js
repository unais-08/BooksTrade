// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: ["nativewind/babel"],
//   };
// };
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel", // NativeWind for Tailwind CSS in React Native
      [
        "module:react-native-dotenv", // Plugin to load environment variables
        {
          moduleName: "@env", // Allows you to import env variables
          path: ".env", // Path to your .env file
        },
      ],
    ],
  };
};
