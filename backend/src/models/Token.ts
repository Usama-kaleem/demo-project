import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./User";

@Table
export class Token extends Model<Token>{

    @Column({
        allowNull: false
    })
    token?: string;
    
    @ForeignKey(()=>User)
    @Column
    userId?: number;

    @BelongsTo(()=>User)
    users?: User;

    @Column({
        type: DataType.ENUM('access', 'refresh'),
        allowNull:false
    })
    type?: 'access'| 'refresh';
}