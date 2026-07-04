

import { RegisterData, User } from "@/types/auth";

const STORAGE_KEY = "users";

interface StoredUser extends User {
  password: string;
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const users = localStorage.getItem(STORAGE_KEY);

  let parsedUsers: StoredUser[] = users
    ? JSON.parse(users)
    : [];

    console.log("getUsers() called");

  // Create default admin if it doesn't exist
  const adminExists = parsedUsers.some(
    (user) =>
      user.role === "admin" &&
      user.email ===
        "admin@weddingplanner.com"
  );

  if (!adminExists) {
  console.log("Creating default admin...");

  const defaultAdmin: StoredUser = {
    _id: crypto.randomUUID(),

    name: "Platform Admin",

    email: "admin@weddingplanner.com",

    phone: "9999999999",

    password: "admin123",

    avatar: "",

    role: "admin",

    isVerified: true,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  parsedUsers.push(defaultAdmin);

  console.log("Users before save:", parsedUsers);

  saveUsers(parsedUsers);

  console.log(
    "Users after save:",
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
}

  return parsedUsers;
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user._id === updatedUser._id
      ? {
          ...user,
          ...updatedUser,
          updatedAt: new Date().toISOString(),
        }
      : user
  );

  saveUsers(updatedUsers);
}


export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): {
  success: boolean;
  message: string;
} {
  const users = getUsers();

  const user = users.find(
    (item) => item._id === userId
  );

  if (!user) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  if (user.password !== currentPassword) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  user.password = newPassword;

  user.updatedAt = new Date().toISOString();

  saveUsers(users);

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(
  data: RegisterData
): {
  success: boolean;
  message: string;
  user?: User;
} {
  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      data.email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "Email already registered.",
    };
  }



  
  const newUser: StoredUser = {
    _id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    avatar: "",
    role: "customer",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  saveUsers(users);

  const { password, ...user } = newUser;

  return {
    success: true,
    message: "Registration successful.",
    user,
  };
}

export function loginUser(
  email: string,
  password: string
): {
  success: boolean;
  message: string;
  user?: User;
} {
  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.toLowerCase()
  );

  if (!existingUser) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  if (existingUser.password !== password) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  // Vendor Approval Check
  if (existingUser.role === "vendor") {
    if (existingUser.status === "pending") {
      return {
        success: false,
        message:
          "Your vendor account is pending admin approval.",
      };
    }

    if (existingUser.status === "rejected") {
      return {
        success: false,
        message:
          "Your vendor account has been rejected by the admin.",
      };
    }
  }

  const { password: _, ...user } = existingUser;

  return {
    success: true,
    message: "Login successful.",
    user,
  };
}