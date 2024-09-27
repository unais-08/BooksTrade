import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.unais.BookTrade",
  projectId: "66f64c2a0026e2fbaefc",
  databaseId: "66f64d9c00135d66bb33",
  userCollectionId: "66f64dbb0038d058a1a3",
  booksCollectionId: "66f64de1000255995887",
  storageId: "66f64f290026dbb0013d",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username) {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount || !newAccount.$id) {
      throw new Error("Failed to create account");
    }

    const avatarUrl = avatar.getInitials(username);

    // Sign in the user
    await signIn(email, password);

    // Create a new document in the database with user details {commented by Shaikh Unais}
    const newUser = await databases.createDocument(
      config.databaseId, // Your database ID
      config.userCollectionId, // Your user collection ID
      ID.unique(), // Document ID
      {
        accountId: newAccount.$id,  // Store the account ID
        email, // Store the email
        username, // Store the username
        avatar: avatarUrl, // Store the avatar URL
      }
    );

    return newUser; // Return the newly created user document
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    throw new Error(error); // Re-throw the error
  }
}

//Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    console.log("Session created: ", session); //I am log this session for debugging purpose ( by unais)
    return session; // Return the session object
  } catch (error) {
    console.error("Error in signIn:", error);
    throw new Error(error);
  }
}
