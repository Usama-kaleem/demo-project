import { AutoIncrement, Column, HasMany, Model, Table } from "sequelize-typescript";
import { TaskList } from "./TaskList";
import { UserTaskList } from "./UserTaskList";

@Table
export class User extends Model {
    @Column
    name?: string

    @Column({
        unique: true,
        allowNull: false
    })
    email?: string

    @Column
    password?: string

    @HasMany(() => UserTaskList)
    userTaskLists?: UserTaskList[];

    @HasMany(() => TaskList)
    taskLists?: TaskList[];

}
