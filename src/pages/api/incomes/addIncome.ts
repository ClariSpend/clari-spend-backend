import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { IncomeSchema } from "@/types/incomes";
import { NextApiRequest, NextApiResponse } from "next";

type IncomeResponse = {
    income: IncomeSchema | null;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IncomeResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'POST') {
        try {
            const { amount } = req.body;

            if (!amount) {
                return res.status(400).json({
                    error: "Missing required field: amount is required",
                    income: null,
                });
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({
                    error: "Amount must be a positive number",
                    income: null,
                });
            }

            const newIncome = await prisma.income.create({
                data: {
                    amount,
                    date: new Date(),
                    createdById: user.id,
                }
            });

            return res.status(200).json({ income: newIncome })
        } catch (error) {
            return res.status(500).json({ 
                error: 'Failed to create income', 
                income: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', income: null });
    }
}

export default withAuth(handler);