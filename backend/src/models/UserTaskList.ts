
import { Column, Table,Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";
import { TaskList } from "./TaskList";

@Table
export class UserTaskList extends Model{

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @ForeignKey(() => TaskList)
    @Column
    taskListId!: number;

}