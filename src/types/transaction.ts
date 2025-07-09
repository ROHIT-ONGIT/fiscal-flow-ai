export type Transaction = {
    id: string; 
    date: Date;
    description: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    category: string;
    type: 'income' | 'expense';
};

