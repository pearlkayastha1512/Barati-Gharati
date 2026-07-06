import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ===================================
  // CREATE OR UPDATE
  // ===================================

  async createOrUpdate(
    userId: string,
    dto: CreateBudgetDto,
  ) {
    await this.prisma.budget.upsert({
      where: {
        userId,
      },

      update: {
        totalBudget: dto.budget,
      },

      create: {
        userId,
        totalBudget: dto.budget,
      },
    });

    return {
      success: true,
      message: 'Budget saved successfully.',
    };
  }

  // ===================================
  // GET MY BUDGET
  // ===================================

  async findMine(userId: string) {
    const budget =
      await this.prisma.budget.findUnique({
        where: {
          userId,
        },
      });

    if (!budget) {
      return {
        success: true,

        data: {
          budget: 1000000,
        },
      };
    }

    return {
      success: true,

      data: {
        budget: Number(
          budget.totalBudget,
        ),
      },
    };
  }

  // ===================================
  // BUDGET SUMMARY
  // ===================================

  async getSummary(userId: string) {
    const budget =
      await this.prisma.budget.findUnique({
        where: {
          userId,
        },

        include: {
          expenses: true,
        },
      });

    if (!budget) {
      return {
        success: true,

        data: {
          totalBudget: 1000000,

          spentAmount: 0,

          remainingBudget: 1000000,

          categoryBreakdown: {},
        },
      };
    }

    const spentAmount =
      budget.expenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0,
      );

    const remainingBudget =
      Number(budget.totalBudget) -
      spentAmount;

    const categoryBreakdown: Record<
      string,
      number
    > = {};

    for (const expense of budget.expenses) {
      categoryBreakdown[
        expense.category
      ] =
        (categoryBreakdown[
          expense.category
        ] ?? 0) +
        Number(expense.amount);
    }

    return {
      success: true,

      data: {
        totalBudget: Number(
          budget.totalBudget,
        ),

        spentAmount,

        remainingBudget,

        categoryBreakdown,
      },
    };
  }

  // ===================================
  // UPDATE
  // ===================================

  async update(
    userId: string,
    dto: UpdateBudgetDto,
  ) {
    await this.prisma.budget.upsert({
      where: {
        userId,
      },

      update: {
        totalBudget: dto.budget,
      },

      create: {
        userId,
        totalBudget: dto.budget,
      },
    });

    return {
      success: true,
      message:
        'Budget updated successfully.',
    };
  }

  // ===================================
  // RESET
  // ===================================

  async remove(userId: string) {
    const budget =
      await this.prisma.budget.findUnique({
        where: {
          userId,
        },
      });

    if (budget) {
      await this.prisma.budget.delete({
        where: {
          userId,
        },
      });
    }

    return {
      success: true,
      message:
        'Budget reset successfully.',
    };
  }
}