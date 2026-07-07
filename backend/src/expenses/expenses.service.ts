import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  private async getOwnedBudget(userId: string) {
    return this.prisma.budget.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        totalBudget: 1000000,
      },
    });
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const budget = await this.getOwnedBudget(userId);

    return this.prisma.expense.create({
      data: {
        budgetId: budget.id,
        title: dto.title,
        category: dto.category,
        amount: dto.amount,
        note: dto.note,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async findAll(userId: string) {
    const budget = await this.getOwnedBudget(userId);

    return this.prisma.expense.findMany({
      where: { budgetId: budget.id },
      orderBy: { date: 'desc' },
    });
  }

  async findByCategory(userId: string, category: string) {
    const budget = await this.getOwnedBudget(userId);

    return this.prisma.expense.findMany({
      where: { budgetId: budget.id, category },
      orderBy: { date: 'desc' },
    });
  }

  private async getOwnedExpense(userId: string, expenseId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: { budget: true },
    });

    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.budget.userId !== userId)
      throw new ForbiddenException('You can only manage your own expenses');

    return expense;
  }

  async update(userId: string, expenseId: string, dto: UpdateExpenseDto) {
    await this.getOwnedExpense(userId, expenseId);

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        title: dto.title,
        category: dto.category,
        amount: dto.amount,
        note: dto.note,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async remove(userId: string, expenseId: string) {
    await this.getOwnedExpense(userId, expenseId);

    await this.prisma.expense.delete({ where: { id: expenseId } });
    return { message: 'Expense deleted successfully' };
  }
}
