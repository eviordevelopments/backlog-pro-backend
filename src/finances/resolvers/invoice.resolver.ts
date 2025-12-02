import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateInvoiceCommandHandler } from '@finances/application/commands/create-invoice.command-handler';
import { CreateInvoiceCommand } from '@finances/application/commands/create-invoice.command';
import { InvoiceRepository } from '@finances/repository/invoice.repository';
import { CreateInvoiceDto } from '@finances/dto/request/create-invoice.dto';
import { InvoiceResponseDto } from '@finances/dto/response/invoice.response.dto';

@Resolver('Invoice')
export class InvoiceResolver {
  constructor(
    private readonly createInvoiceHandler: CreateInvoiceCommandHandler,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @Mutation(() => InvoiceResponseDto)
  @UseGuards(JwtAuthGuard)
  async createInvoice(
    @Args('input') input: CreateInvoiceDto
  ): Promise<InvoiceResponseDto> {
    const command = new CreateInvoiceCommand(
      input.invoiceNumber,
      input.clientId,
      input.amount,
      input.tax,
      input.issueDate,
      input.dueDate,
      input.projectId,
      input.items,
      input.notes
    );

    const invoice = await this.createInvoiceHandler.handle(command);

    return {
      id: invoice.getId(),
      invoiceNumber: invoice.getInvoiceNumber(),
      clientId: invoice.getClientId(),
      projectId: invoice.getProjectId() ?? undefined,
      amount: invoice.getAmount().getValue(),
      tax: invoice.getTax().getValue(),
      total: invoice.getTotal().getValue(),
      status: invoice.getStatus().getValue(),
      issueDate: invoice.getIssueDate(),
      dueDate: invoice.getDueDate(),
      paidDate: invoice.getPaidDate() ?? undefined,
      items: invoice.getItems(),
      notes: invoice.getNotes(),
      createdAt: invoice.getCreatedAt(),
      updatedAt: invoice.getUpdatedAt(),
    };
  }

  @Query(() => [InvoiceResponseDto])
  @UseGuards(JwtAuthGuard)
  async listInvoices(
    @Args('clientId', { nullable: true }) clientId?: string,
    @Args('projectId', { nullable: true }) projectId?: string
  ): Promise<InvoiceResponseDto[]> {
    let invoices = [];

    if (clientId) {
      invoices = await this.invoiceRepository.getByClientId(clientId);
    } else if (projectId) {
      invoices = await this.invoiceRepository.getByProjectId(projectId);
    } else {
      invoices = await this.invoiceRepository.list();
    }

    return invoices.map((inv) => ({
      id: inv.getId(),
      invoiceNumber: inv.getInvoiceNumber(),
      clientId: inv.getClientId(),
      projectId: inv.getProjectId() ?? undefined,
      amount: inv.getAmount().getValue(),
      tax: inv.getTax().getValue(),
      total: inv.getTotal().getValue(),
      status: inv.getStatus().getValue(),
      issueDate: inv.getIssueDate(),
      dueDate: inv.getDueDate(),
      paidDate: inv.getPaidDate() ?? undefined,
      items: inv.getItems(),
      notes: inv.getNotes(),
      createdAt: inv.getCreatedAt(),
      updatedAt: inv.getUpdatedAt(),
    }));
  }
}
