"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// Define CreateUserParams interface
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  // Add other fields as necessary
}

// Define UpdateUserParams interface
interface UpdateUserParams {
  name?: string;
  email?: string;
  password?: string;
  // Add other fields as necessary
}

// CREATE
/**
 * Create a new user in the database.
 * @param {CreateUserParams} user - The user details.
 * @returns {Promise<any>} The created user.
 */
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
/**
 * Get a user by their ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} The found user.
 */
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
/**
 * Update a user by their clerk ID.
 * @param {string} clerkId - The clerk ID of the user.
 * @param {UpdateUserParams} user - The updated user details.
 * @returns {Promise<any>} The updated user.
 */
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
/**
 * Delete a user by their clerk ID.
 * @param {string} clerkId - The clerk ID of the user.
 * @returns {Promise<any>} The deleted user.
 */
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) throw new Error("User not found");

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
/**
 * Update a user's credits by a specified amount.
 * @param {string} userId - The ID of the user.
 * @param {number} creditFee - The amount to update the user's credits by.
 * @returns {Promise<any>} The updated user.
 */
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );
    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
