export type IncomeSchema = {
    id: string;
    amount: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string | null;
}