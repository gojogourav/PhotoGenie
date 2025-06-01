import * as jwt from 'jsonwebtoken'
import { prisma } from 'db/index';
import { NextFunction, Request, Response } from "express"
import { z } from "zod";
import * as bcrypt from 'bcryptjs'

const registerControllerValidation = z.object({
    email: z.string().email().nonempty(),
    username: z.string().toLowerCase().max(10).min(4).nonempty(),
    password: z.string().max(20).min(10).nonempty(),
    name: z.string().nonempty(),
})

const generateToken = (res: Response, userId: string): void => {
    try {
        const access_token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        const refresh_token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict' as const,
            path: '/',
        };
        res.cookie('access_token', access_token, { ...cookieOptions, maxAge: 60 * 60 * 1000 });
        res.cookie('refresh_token', refresh_token, cookieOptions);
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new Error("Failed to generate authentication tokens.");
    }
};

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsedBody = registerControllerValidation.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(401).json({ message: "Please enter valid details" })
            return
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{username: parsedBody.data.username},{email: parsedBody.data.email}]
            }
        })
        if (existingUser) {
            res.status(401).json({ message: "Error user already exists" })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);


        const newUser = await prisma.user.create({
            data: {
                username: parsedBody.data?.username,
                password: hashedPassword,
                email: parsedBody.data.email,
                name: parsedBody.data.name
            }
        })

        generateToken(res, newUser.id);


        res.status(200).json({ message: "user created successfully ", user: newUser })
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create user ", error })
        return;
    }
}


