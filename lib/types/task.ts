export interface Task {
    id: string;
    userId: string;
    company: string;
    taskType: 'es' | 'web-test' | 'interview';
    deadline: Date;
    attachment?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateTaskInput {
    company: string;
    taskType: 'es' | 'web-test' | 'interview';
    deadline: Date;
    attachment?: string;
  }