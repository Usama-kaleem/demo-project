

export interface ITasks {
    id: number;
    title: string;
    description: string;
    deadline: Date;
    status: 'pending' | 'completed';
    taskListId: number;
    createdAt: Date;
    updatedAt: Date;
}