import db from "../lib/db"
import { ERROR_MESSAGE } from "../utils/constant/error"

export async function like(userID: string, threadID: string): Promise<string> {
    const thisThread = await db.thread.findFirst({
        where: {
            id: threadID
        }
    })

    if(!thisThread) {
        throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
    }

    const existLike = await db.like.findFirst({
        where: {
            userId: userID,
            threadId: threadID
        }
    })

    if(existLike) {
        await db.like.deleteMany({
            where: {
                userId: userID,
                threadId: threadID
            }
        })

        return `Success unlike thread with ID ${threadID}`
    }

    await db.like.create({
        data: {
            userId: userID,
            threadId: threadID
        }
    })

    return `Success like thread with ID ${threadID}`
}

export async function checkLike(userId: string ,threadId: string) {
    const thisThread = await db.thread.findFirst({
        where: {
            id: threadId
        },
        select: {
            _count: {
                select: {
                    like: true
                }
            }
        }
    })

    const totalLike = thisThread?._count.like

    const thisLike = await db.like.findFirst({
        where: {
            userId,
            threadId
        },
    })

    const data = {
        thisLike,
        totalLike
    }

    return data
}