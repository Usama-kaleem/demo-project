import { AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User";
import { Task } from "./Task";
import { UserTaskList } from "./UserTaskList";


@Table
export class TaskList extends Model{
    @Column({
        allowNull: false,
        unique: true
    })
    slug?: string;

    @ForeignKey(() => User)
    @Column
    userId?: number;

    
    @Column({
        unique: true,
        allowNull: false
    })
    name?: string;

    @HasMany(() => Task)
    tasks?: Task[];

    @HasMany(() => UserTaskList)
    userTaskLists?: UserTaskList[];

    @BelongsTo(() => User)
    users?: User[];
}