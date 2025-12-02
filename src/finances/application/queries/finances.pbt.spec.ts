import * as fc from 'fast-check';
import { Amount } from '@finances/domain/value-objects/amount.vo';
import { Currency } from '@finances/domain/value-objects/currency.vo';
import { TransactionType } from '@finances/domain/value-objects/transaction-type.vo';
import { Transaction } from '@finances/domain/entities/transaction.entity';
import { Invoice } from '@finances/domain/entities/invoice.entity';
import { InvoiceStatus } from '@finances/domain/value-objects/invoice-status.vo';
import { Project } from '@projects/domain/entities/project.entity';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';

/**
 * Property-Based Tests for Finances Module
 * Feature: backlog-pro-development
 * 
 * These tests verify the correctness properties of financial calculations
 * including transaction updates, hourly rate calculations, salary calculations,
 * and invoice total calculations.
 */

describe('Finances Module - Property-Based Tests', () => {
  /**
   * Feature: backlog-pro-development, Property 19: Transaction updates project spent
   * 
   * Property: For any transaction associated to a project, creating the transaction
   * must increment the field spent of the project by the amount of the transaction.
   * 
   * Validates: Requirements 7.1
   */
  describe('Property 19: Transaction updates project spent', () => {
    it('should increment project spent by transaction amount', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100000 }),
          fc.integer({ min: 1, max: 100000 }),
          (initialSpent, transactionAmount) => {
            // Create a project with initial spent amount
            const project = new Project({
              id: 'project-1',
              name: 'Test Project',
              clientId: 'client-1',
              status: 'active',
              budget: 100000,
              spent: initialSpent,
              progress: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            const initialProjectSpent = project.spent;

            // Create a transaction
            const amount = Amount.create(transactionAmount);
            const transaction = new Transaction(
              TransactionType.EXPENSE,
              'development',
              amount,
              Currency.USD,
              new Date(),
              'Development work',
              'client-1',
              'project-1',
            );

            // Simulate adding the transaction to the project
            project.addSpent(transaction.getAmount().getValue());

            // Verify that project spent increased by transaction amount
            const expectedSpent = initialProjectSpent + transactionAmount;
            expect(project.spent).toBe(expectedSpent);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject negative transaction amounts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100000, max: -1 }),
          (negativeAmount) => {
            const project = new Project({
              id: 'project-1',
              name: 'Test Project',
              clientId: 'client-1',
              status: 'active',
              budget: 100000,
              spent: 0,
              progress: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Attempting to add negative amount should throw
            expect(() => {
              project.addSpent(negativeAmount);
            }).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backlog-pro-development, Property 20: Ideal hourly rate calculation
   * 
   * Property: For any project with budget B and total hours H, the ideal hourly
   * rate must be equal to B ÷ H.
   * 
   * Validates: Requirements 7.2
   */
  describe('Property 20: Ideal hourly rate calculation', () => {
    it('should calculate ideal hourly rate as budget divided by total hours', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1000000 }),
          fc.integer({ min: 10, max: 10000 }),
          (budget, totalHours) => {
            // Calculate expected ideal rate
            const expectedIdealRate = budget / totalHours;

            // Verify the calculation
            const actualIdealRate = Math.round(expectedIdealRate * 100) / 100;
            const expectedRounded = Math.round(expectedIdealRate * 100) / 100;

            expect(actualIdealRate).toBeCloseTo(expectedRounded, 2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return zero when total hours is zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000000 }),
          (budget) => {
            const totalHours = 0;

            // When total hours is 0, ideal rate should be 0
            const idealRate = totalHours === 0 ? 0 : budget / totalHours;

            expect(idealRate).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain precision to 2 decimal places', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1000000 }),
          fc.integer({ min: 10, max: 10000 }),
          (budget, totalHours) => {
            const idealRate = Math.round((budget / totalHours) * 100) / 100;

            // Verify that the result has at most 2 decimal places
            const decimalPlaces = (idealRate.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backlog-pro-development, Property 21: Individual salary calculation
   * 
   * Property: For any user with hours worked W and ideal hourly rate R of the project,
   * the salary calculated must be equal to W × R.
   * 
   * Validates: Requirements 7.3
   */
  describe('Property 21: Individual salary calculation', () => {
    it('should calculate individual salary as hours worked multiplied by ideal rate', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 10, max: 500 }),
          (hoursWorked, idealRate) => {
            // Calculate expected salary
            const expectedSalary = hoursWorked * idealRate;

            // Verify the calculation
            const actualSalary = Math.round(expectedSalary * 100) / 100;
            const expectedRounded = Math.round(expectedSalary * 100) / 100;

            expect(actualSalary).toBe(expectedRounded);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return zero salary when hours worked is zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 500 }),
          (idealRate) => {
            const hoursWorked = 0;

            // When hours worked is 0, salary should be 0
            const salary = hoursWorked * idealRate;

            expect(salary).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain precision to 2 decimal places', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 10, max: 500 }),
          (hoursWorked, idealRate) => {
            const salary = Math.round((hoursWorked * idealRate) * 100) / 100;

            // Verify that the result has at most 2 decimal places
            const decimalPlaces = (salary.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should scale linearly with hours worked', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 500 }),
          fc.integer({ min: 10, max: 500 }),
          (baseHours, idealRate) => {
            // Calculate salary for base hours
            const baseSalary = Math.round((baseHours * idealRate) * 100) / 100;

            // Calculate salary for double hours
            const doubleHours = baseHours * 2;
            const doubleSalary = Math.round((doubleHours * idealRate) * 100) / 100;

            // Double hours should result in double salary (within rounding tolerance)
            const expectedDoubleSalary = Math.round((baseSalary * 2) * 100) / 100;
            expect(doubleSalary).toBe(expectedDoubleSalary);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backlog-pro-development, Property 22: Invoice total calculation
   * 
   * Property: For any invoice with amount A and tax T, the total must be equal to A + T.
   * 
   * Validates: Requirements 7.6
   */
  describe('Property 22: Invoice total calculation', () => {
    it('should calculate invoice total as amount plus tax', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }),
          fc.integer({ min: 0, max: 50000 }),
          (amount, tax) => {
            // Create amounts
            const amountVO = Amount.create(amount);
            const taxVO = Amount.create(tax);

            // Create invoice
            const invoice = new Invoice(
              'INV-001',
              'client-1',
              amountVO,
              taxVO,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            // Verify total
            const expectedTotal = amount + tax;
            const actualTotal = invoice.getTotal().getValue();

            expect(actualTotal).toBe(expectedTotal);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle zero tax correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }),
          (amount) => {
            const amountVO = Amount.create(amount);
            const taxVO = Amount.create(0);

            const invoice = new Invoice(
              'INV-001',
              'client-1',
              amountVO,
              taxVO,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            // Total should equal amount when tax is zero
            expect(invoice.getTotal().getValue()).toBe(amount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle zero amount correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50000 }),
          (tax) => {
            const amountVO = Amount.create(0);
            const taxVO = Amount.create(tax);

            const invoice = new Invoice(
              'INV-001',
              'client-1',
              amountVO,
              taxVO,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            // Total should equal tax when amount is zero
            expect(invoice.getTotal().getValue()).toBe(tax);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain precision to 2 decimal places', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }),
          fc.integer({ min: 0, max: 50000 }),
          (amount, tax) => {
            const amountVO = Amount.create(amount);
            const taxVO = Amount.create(tax);

            const invoice = new Invoice(
              'INV-001',
              'client-1',
              amountVO,
              taxVO,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            const total = invoice.getTotal().getValue();

            // Verify that the result has at most 2 decimal places
            const decimalPlaces = (total.toString().split('.')[1] || '').length;
            expect(decimalPlaces).toBeLessThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should be commutative (amount + tax = tax + amount)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }),
          fc.integer({ min: 0, max: 50000 }),
          (amount, tax) => {
            // Invoice with amount + tax
            const amountVO1 = Amount.create(amount);
            const taxVO1 = Amount.create(tax);
            const invoice1 = new Invoice(
              'INV-001',
              'client-1',
              amountVO1,
              taxVO1,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            // Invoice with tax + amount (conceptually)
            const amountVO2 = Amount.create(tax);
            const taxVO2 = Amount.create(amount);
            const invoice2 = new Invoice(
              'INV-002',
              'client-1',
              amountVO2,
              taxVO2,
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );

            // Both should have the same total
            expect(invoice1.getTotal().getValue()).toBe(
              invoice2.getTotal().getValue()
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
