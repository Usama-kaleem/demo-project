
import {Request, Response  } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { getTaskListById } from '../services/taskList.service';
const mykey = 'mykey';

export function generateToken(userId: number, expiresIn='1d' ): string{
    const payload = {userId};
    const token = jwt.sign(payload, mykey, {expiresIn});

    return token; 
}
export function verifyToken(token: string){
    try{
        return jwt.verify(token, mykey)
    }catch(err){
        return null;
    }
}

export async function authenticateJWT(req: Request, res: Response, next: Function) {

    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        res.status(401).json({message: 'Acess Denied :) '});
        return;
    }

    const verified = verifyToken(token);
    if(!verified){
        res.status(401).json({message: 'Invalid Token :((('});
        return;
    }

    User.findByPk((verified as any).userId).then((user)=>{
        if(user){
            (req as any).user = user;
        }
        else{
            res.status(401).json({message: 'User Not Found!!'});
            return;
        }
        next();
    });

}

export async function subdomainAuth(req: Request, res: Response, next: Function){

    const subdomain = req.headers.host?.split('.')[0];
    const taskListId = req.params.id;

    if (!subdomain || !taskListId) {
        console.log('Invalid request');
       res.status(400).json({ message: 'Invalid request' });
       return
    }
    let userId = 1; // Assuming user ID is stored in req.user
    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        res.status(401).json({message: 'Acess Denied '});
        return;
    }

    const verified = verifyToken(token);
    if(!verified){
        res.status(401).json({message: 'Invalid Token :('});
        return;
    }
    
    User.findByPk((verified as any).userId).then((user)=>{
        if(user){
            (req as any).user = user;
            userId=user.id;
        }
        else{
            res.status(401).json({message: 'User Not Found!!'});
            return;
        }
    });

    const taskList = await getTaskListById(taskListId);

    if (!taskList) {
        console.log('Task list not found');
       res.status(404).json({ message: 'Task list not found' });
       return
    }

    if (taskList.userId !== userId) {
        console.log('Forbidden');
       res.status(403).json({ message: 'Forbidden' });
       return
    }


    next();
}