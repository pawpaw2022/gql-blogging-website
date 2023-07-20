/** @format */

import { Profile, User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../index";

const batchUsers = async (ids: string[]): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  // Sort the users in the order of the ids passed in
  const userMap: { [key: number]: User } = {};
  users.forEach((u) => {
    userMap[u.id] = u;
  });

  return ids.map((id) => userMap[id]);
};

const batchProfiles = async (ids: string[]): Promise<Profile[]> => {
  const profiles = await prisma.profile.findMany({
    where: {
      userId: {
        in: ids,
      },
    },
  });

  // Sort the profiles in the order of the ids passed in
  const profileMap: { [key: number]: Profile } = {};
  profiles.forEach((p) => {
    profileMap[p.userId] = p;
  });

  return ids.map((id) => profileMap[id]);
};

// This is the dataloader that will be used in the resolvers
export const userLoader = new DataLoader<string, User>(batchUsers);
export const profileLoader = new DataLoader<string, Profile>(batchProfiles);
// Use: `userLoader().load(id)` to batch and cache the users
