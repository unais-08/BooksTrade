import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Realtime,
  Users,
} from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BOOKS_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
  APPWRITE_MESSAGE_COLLECTION_ID,
} from "@env";

export const config = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  booksCollectionId: APPWRITE_BOOKS_COLLECTION_ID,
  storageId: APPWRITE_STORAGE_ID,
  messageCollectionId: APPWRITE_MESSAGE_COLLECTION_ID,
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
    // Check if the error is due to missing scope (user not logged in)
    if (error.code === 401) {
      console.log("User not authenticated.");
      return null; // Return null if no user session is found
    }
    console.error("Error fetching account:", error);
    throw new Error("Failed to fetch account details. User may not be logged in.");
  }
}

// Register User with session check and handling [ Get Current User]
// export async function getCurrentUser() {
//   try {
//     const currentAccount = await getAccount();
//     if (!currentAccount) throw Error;

//     const currentUser = await databases.listDocuments(
//       config.databaseId,
//       config.userCollectionId,
//       [Query.equal("accountId", currentAccount.$id)]
//     );

//     if (!currentUser) {
//       console.log("No user found with this account ID.");
//       throw Error;
//     }

//     return currentUser.documents[0];
//   } catch (error) {
//     console.error("Error fetching current user:", error);
//     return null;
//   }
// }
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    // Check if there is an active account session
    if (!currentAccount) {
      console.error("No active account session found.");
      return null;
    }

    // Fetch user from the database based on account ID
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // Check if a user is found in the database
    if (!currentUser || currentUser.documents.length === 0) {
      console.log("No user found with this account ID.");
      return null;
    }

    return currentUser.documents[0]; // Return the user data
  } catch (error) {
    console.error("Error fetching current user:", error);
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
        genre: form.genre,
        description: form.description,
        language: form.language,
      }
    );
    // console.log(newPost);

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

export async function getBookDetails(bookId) {
  try {
    const book = await databases.getDocument(
      config.databaseId,
      config.booksCollectionId,
      bookId
    );

    return book;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
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

export const fetchMessages = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.messageCollectionId,
      []
    );
    const messages = response.documents.map((doc) => ({
      _id: doc.userID,
      text: doc.text,
      createdAt: new Date(doc.createdAt),
      user: {
        _id: doc.users,
        name: doc.userName,
        avatar: doc.userAvatar,
      },
    }));
    return messages.reverse(); // Reverse to have newest messages on top
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send message
export const sendMessage = async (message) => {
  try {
    await databases.createDocument(
      config.databaseId, // Your Appwrite database ID
      config.messageCollectionId, // Your message collection ID
      ID.unique(), // Generates a unique ID for the message
      {
        chatID: message.chatID, // Unique chat identifier (could be sender-receiver or a chat group)
        senderID: message.user._id, // Sender's user ID
        receiverID: message.receiverID, // Receiver's user ID
        messageText: message.text, // The actual message content
        createdAt: new Date(), // Timestamp for when the message is created
        senderName: message.user.name, // Sender's name
      }
    );
  } catch (error) {
    console.error("Error sending message in sendMessage function:", error);
    throw error;
  }
};
export const getMessagesForChat = async (chatID) => {
  if (!chatID) {
    console.error("Invalid chatID: chatID is required");
    return [];
  }
  try {
    // Query to list documents from the Appwrite database and collection
    const response = await databases.listDocuments(
      config.databaseId, // Your Appwrite database ID
      config.messageCollectionId, // Your message collection ID
      [
        Query.equal("chatID", chatID), // Filter messages by chatID
        Query.orderDesc("createdAt"), // Sort messages by time (most recent first)
      ]
    );

    return response.documents; // Returns an array of message documents
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};
// Real-time subscription

export const subscribeToMessages = (callback) => {
  const unsubscribe = client.subscribe(
    `databases.${config.databaseId}.collections.${config.messageCollectionId}.documents`,
    (response) => {
      console.log("Received real-time response:", response); // Log received events

      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        callback(response.payload);
      }
    }
  );

  return unsubscribe; // Return unsubscribe function for cleanup
};
// Fetch all users from the Users collection
export const fetchUsers = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId
    ); // Replace 'users_collection_id' with your actual users collection ID

    return response.documents.map((doc) => ({
      accountId: doc.$id,
      username: doc.username, // Adjust based on your user document structure
      email: doc.email, // Adjust based on your user document structure
      avatar: doc.avatar, // Adjust based on your user document structure
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getConnectedUsers = async (userId) => {
  try {
    // console.log("Logged User ID:", userId); // Log userId to ensure it's correct

    // Query messages where the user is either sender or receiver
    const response = await databases.listDocuments(
      config.databaseId,
      config.messageCollectionId,
      [
        Query.or([
          Query.equal("senderID", userId),
          Query.equal("receiverID", userId),
        ]),
      ]
    );

    // console.log(response); // Log the query response to see if documents are fetched

    // If no documents were returned, log that and return early
    if (response.documents.length === 0) {
      // console.log("No messages found for the user.");
      return [];
    }

    // Extract unique user IDs who have chatted with the logged-in user
    const usersSet = new Set();

    response.documents.forEach((message) => {
      // console.log("Processing message:", message); // Log each message for debugging

      if (message.senderID !== userId) {
        usersSet.add(message.senderID); // Add sender if not the logged-in user
      }
      if (message.receiverID !== userId) {
        usersSet.add(message.receiverID); // Add receiver if not the logged-in user
      }
    });

    const uniqueUserIds = Array.from(usersSet);

    if (uniqueUserIds.length === 0) {
      return []; // Return empty array if no users found
    }

    // Fetch user details for these IDs
    const users = await getUsersByIds(uniqueUserIds);
    // console.log("Fetched users:", users); // Log fetched users
    return users;
  } catch (error) {
    console.error("Error fetching connected users:", error);
    throw error;
  }
};

export const getUsersByIds = async (userIds) => {
  try {
    // Check if userIds array is empty
    if (userIds.length === 0) {
      console.log("No user IDs provided.");
      return []; // Return empty array if no IDs are given
    }

    const userPromises = userIds.map((userId) =>
      databases.getDocument(
        // Use the databases instance here
        config.databaseId,
        config.userCollectionId,
        userId
      )
    );

    // Wait for all promises to resolve
    const users = await Promise.all(userPromises);

    // Optionally, filter out any undefined or null results
    const validUsers = users.filter(
      (user) => user !== undefined && user !== null
    );

    return validUsers;
  } catch (error) {
    // console.error("Error fetching user details:", error);
    throw error;
  }
};
