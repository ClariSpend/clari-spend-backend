import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { IncomeSchema } from "@/types/incomes";
import { NextApiRequest, NextApiResponse } from "next";

type IncomeResponse = {
    incomes: IncomeSchema[];
    totalAmount: number;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IncomeResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'GET') {
        try {
            const incomes = await prisma.income.findMany({
                where: {
                    createdById: user.id,
                },
                orderBy: { date: 'desc' },
            });

            let totalAmount = 0;

            incomes.map(income => {
                totalAmount += income.amount;
            });

            return res.status(200).json({ incomes, totalAmount });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to load expenses', incomes: [], totalAmount: 0 });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', incomes: [], totalAmount: 0 });
    }
}

export default withAuth(handler);