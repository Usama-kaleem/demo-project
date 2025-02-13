import { Token } from "../models/Token"


export const addToken = async (
    token: string,
    type: 'access'| 'refresh',
    userId: number
)=> {
    const tokenisntance = new Token();
    tokenisntance.token = token;
    tokenisntance.type= type;
    tokenisntance.userId= userId;

    tokenisntance.save();

    return tokenisntance;
}

export const deleteToken = async (userId: number) =>{
    return Token.destroy({
        where:{
            userId
        }
    })
} 

export const getToken = async (token: string) =>{
    return Token.findOne({
        where:{
            token
        }
    })
} 