/**
 * Invoice
 *
 * Shared domain model representing a billing document issued to a client
 * for delivered services, typically following an accepted Quotation.
 * Pure data shape only: no behaviour, no persistence, no validation
 * logic. ZAR and other currencies are represented via the currency field,
 * never assumed.
 */

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  VOID = "VOID",
}

export interface InvoiceLineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly total: number;
}

export interface Invoice {
  readonly id: string;
  readonly clientId: string;
  readonly projectId: string | null;
  readonly quotationId: string | null;
  readonly invoiceNumber: string;
  readonly currency: string;
  readonly lineItems: readonly InvoiceLineItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly amountPaid: number;
  readonly status: InvoiceStatus;
  readonly issuedAt: Date | null;
  readonly dueDate: Date;
  readonly createdAt: Date;
}