import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BOOKS_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
} from "@env";
export const config = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  booksCollectionId: APPWRITE_BOOKS_COLLECTION_ID,
  storageId: APPWRITE_STORAGE_ID,
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

    // Sign in the user (added by me Unais:  Sign in the user (session management is inside signIn now))
    await signIn(email, password);

    // Create a new document in the database with user details {commented by Shaikh Unais}
    const newUser = await databases.createDocument(
      config.databaseId, // Your database ID
      config.userCollectionId, // Your user collection ID
      ID.unique(), // Document ID
      {
        accountId: newAccount.$id, // Store the account ID
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

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Register User with session check and handling
// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

//It is only Testing functionality - 27 sept 2024
//retrive info from appwrite and display in home.jsx Ui {by Unais}
export async function getAuthenticatedUser() {
  try {
    const currentUser = await account.get(); // Retrieves the current user's account info
    console.log("Current User:", currentUser);
    return currentUser;
  } catch (error) {
    console.error("Error fetching user account:", error.message);
    return null;
  }
}

// Example usage
getAuthenticatedUser().then((user) => {
  if (user) {
    console.log("Username:", user.name); // Display the username
  }
});
