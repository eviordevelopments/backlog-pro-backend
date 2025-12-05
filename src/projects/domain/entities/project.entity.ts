import { InvalidBudgetException } from '../exceptions/invalid-budget.exception';
import { InvalidProgressException } from '../exceptions/invalid-progress.exception';
import { InvalidSpentAmountException } from '../exceptions/invalid-spent-amount.exception';

export class Project {
  id!: string;
  name!: string;
  description?: string;
  clientId!: string;
  status!: string; // 'planning', 'active', 'on_hold', 'completed', 'archived'
  methodology?: string; // 'scrum', 'kanban', etc.
  budget!: number;
  spent!: number;
  startDate?: Date;
  endDate?: Date;
  progress!: number; // 0-100
  devopsStage?: string;
  priority?: string; // 'low', 'medium', 'high', 'critical'
  tags?: string[];
  repositoryUrl?: string;
  deploymentUrl?: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(data: Partial<Project>) {
    Object.assign(this, data);
  }

  updateBudget(newBudget: number): void {
    if (newBudget < 0) {
      throw new InvalidBudgetException(newBudget);
    }
    this.budget = newBudget;
    this.updatedAt = new Date();
  }

  addSpent(amount: number): void {
    if (amount < 0) {
      throw new InvalidSpentAmountException(amount);
    }
    this.spent += amount;
    this.updatedAt = new Date();
  }

  updateProgress(newProgress: number): void {
    if (newProgress < 0 || newProgress > 100) {
      throw new InvalidProgressException(newProgress);
    }
    this.progress = newProgress;
    this.updatedAt = new Date();
  }
}
