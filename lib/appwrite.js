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
const storage = new Storage(client);

//create Users
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

//sign out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account of User
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Register User with session check and handling [ Get Current User]
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

//File Upload
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

//File Preview function
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

//create Trade post
export async function createBookPost(form) {
  try {
    const [coverImageUrl] = await Promise.all([
      uploadFile(form.coverImage, "image"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.booksCollectionId,
      ID.unique(),
      {
        title: form.title,
        coverImage: coverImageUrl,
        author: form.author,
        creator: form.userId,
      }
    );
    console.log(newPost);

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all books Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.booksCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
//Get the post of login user in profile screen
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.booksCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
    // console.log(posts.documents);
  } catch (error) {
    throw new Error(error);
  }
}

// Searching post through title - function
export async function searchPost(query) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.booksCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
    // console.log(posts.documents);
  } catch (error) {
    throw new Error(error);
  }
}

//It will work as (Trending) or latest post section
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.booksCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    return posts.documents;
    // console.log(posts.documents);
  } catch (error) {
    throw new Error(error);
  }
}

//for refreshing screen (I created this for purpose of it reusability...(Unais) changes can be done)
export async function generalOnRefresh(setRefreshing, ...refetchFunctions) {
  setRefreshing(true);
  for (let refetch of refetchFunctions) {
    await refetch(); // Await each refetch function
  }
  setRefreshing(false);
}
