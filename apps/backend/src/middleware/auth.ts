import { prisma } from "db/index";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'


export interface AuthenticationRequest extends Request {
    user?:{id:string}
}

export const authMiddleware = async(req:AuthenticationRequest,res:Response,next:NextFunction):Promise<void>=>{
    try{
        console.log("Middleware is working!");
        
        let access_token: string | undefined = req?.cookies.access_token
        let refresh_token: string | undefined = req?.cookies.refresh_token;

        if (access_token) {
            try {
                const decoded = await jwt.verify(access_token, process.env.JWT_SECRET!) as jwt.JwtPayload;
                req.user = { id: decoded.id };
                return next();
            } catch (accessTokenError) {
                res.json({ message: "Failed to authenticate", status: 401 })
                return
            }
        }
        if(refresh_token){
            try{
                const decoded = await jwt.verify(refresh_token,process.env.JWT_SECRET!) as jwt.JwtPayload
                const user = await prisma.user.findFirst({
                    where:{id:decoded.id},
                    select:{id:true}
                })
                if(!user){
                    res.clearCookie('refresh_token');
                    res.status(401).json({ message: 'User no longer exists' });
                    return
                }
                const access_token = jwt.sign({id:decoded.id},process.env.JWT_SECRET!,{
                    expiresIn:'1h'
                })

                res.cookie('access_token',access_token,{
                    httpOnly:true,
                    secure:true,
                    maxAge:60*60*1000,
                    sameSite:'strict'
                })
                req.user = {id:user.id}
                return next();
            }catch(error){
                res.clearCookie('access_token');
                res.clearCookie('refresh_token');
                res.status(401).json({ message: 'Session expired. Please log in again.' });
                return;
            }
        }
    }catch(error){
res.clearCookie('access_token');
                res.clearCookie('refresh_token');
                res.status(401).json({ message: 'Internal Server Error. Please log in again.' });
                return;
    }
}