import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(
    private readonly budgetsService: BudgetsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create wedding budget',
  })
  createOrUpdate(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateBudgetDto,
  ) {
    return this.budgetsService.createOrUpdate(
      userId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get wedding budget',
  })
  findMine(
    @CurrentUser('sub') userId: string,
  ) {
    return this.budgetsService.findMine(
      userId,
    );
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Budget summary',
  })
  getSummary(
    @CurrentUser('sub') userId: string,
  ) {
    return this.budgetsService.getSummary(
      userId,
    );
  }

  @Patch()
  @ApiOperation({
    summary: 'Update wedding budget',
  })
  update(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(
      userId,
      dto,
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Reset wedding budget',
  })
  remove(
    @CurrentUser('sub') userId: string,
  ) {
    return this.budgetsService.remove(
      userId,
    );
  }
}