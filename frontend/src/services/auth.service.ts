

import { RegisterData, User } from "@/types/auth";

const STORAGE_KEY = "users";

interface StoredUser extends User {
  password: string;
}

export function getUsers(): StoredUser[] {
  const users = localStorage.getItem(STORAGE_KEY);

  if (!users) {
    return [];
  }

  return JSON.parse(users);
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

  const { password: _, ...user } = existingUser;

  return {
    success: true,
    message: "Login successful.",
    user,
  };
}