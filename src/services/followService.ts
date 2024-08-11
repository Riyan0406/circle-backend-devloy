import db from "../lib/db"
import { ERROR_MESSAGE } from "../utils/constant/error"

export async function follow(id: string, followingID: string) {
    if(followingID === id) {
        throw new Error("Follow denied!")
    }

    const userTFollow = await db.user.findFirst({
        where: {
            id: followingID
        }
    })

    if(!userTFollow) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    const existFollow = await db.follow.findFirst({
        where: {
            followedById: id,
            followingId: followingID
        }
    })

    if(existFollow) {
        await db.follow.deleteMany({
            where: {
                followedById: id,
                followingId: followingID
            }
        })

        return `Success unfollow user with ID ${followingID}`
    }

    await db.follow.create({
        data: {
            followedById: id,
            followingId: followingID
        }
    })

    return `Success follow user with ID ${followingID}`
}