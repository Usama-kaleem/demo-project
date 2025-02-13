import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TaskList } from "./TaskList";

@Table
export class Task extends Model {
    @Column
    title?: string

    @Column
    deadline?: Date

    @Column({
            type: DataType.ENUM('pending', 'completed'),
            allowNull:false
    })
    status?: 'pending'| 'completed';

    @Column
    description?: string

    @ForeignKey(() => TaskList)
    @Column
    taskListId?: number;
}