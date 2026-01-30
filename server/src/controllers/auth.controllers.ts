import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/auth.middleware";



export const registerUser = async (req: Request, res: Response)=>{
    const { name, email, password} = req.body;

    const exiting = await AuthService.findByEmail(email);
    if(exiting){
        return res.status(404).json({Message: "User alreday registered"});
    }

    const user = await AuthService.createUser({ name, email, password});
    const token = AuthService.generateToken(user);


    return res.status(201).json({message: "User registere", token, user: {
        id: user.id, name: user.name, email: user.email
    }});
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password} = req.body;

    const user = await AuthService.findByEmail(email);
    if(!user){
        return res.status(401).json({message: "User not found"})
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log('bycrypt pass:', valid)
    if(!valid){
        return res.status(401).json({message: "Passowrd is incorrect"})
    }
    
    const token = AuthService.generateToken(user);
    return res.json({message: "Login successful",token, user:{
        id: user.id,
        name: user.name,
        email: user.email
    }})
}

export const me = async ( req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized"});

    res.json({ user: req.user});
}