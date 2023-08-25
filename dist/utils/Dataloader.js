/** @format */
import DataLoader from "dataloader";
import { prisma } from "../index";
const batchUsers = async (ids) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    // Sort the users in the order of the ids passed in
    const userMap = {};
    users.forEach((u) => {
        userMap[u.id] = u;
    });
    return ids.map((id) => userMap[id]);
};
// This is the dataloader that will be used in the resolvers
export const userLoader = new DataLoader(batchUsers);
// Use: `userLoader().load(id)` to batch and cache the users
