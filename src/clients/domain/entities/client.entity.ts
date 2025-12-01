import { v4 as uuid } from 'uuid';

export class Client {
  private id: string;
  private name: string;
  private email: string;
  private phone: string;
  private company: string;
  private industry: string;
  private status: string;
  private ltv: number;
  private cac: number;
  private mrr: number;
  private contractStart: Date | null;
  private contractEnd: Date | null;
  private npsScore: number | null;
  private csatScore: number | null;
  private notes: string;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    name: string,
    email: string,
    phone: string = '',
    company: string = '',
    industry: string = '',
    id?: string,
    status?: string,
    ltv?: number,
    cac?: number,
    mrr?: number,
    contractStart?: Date | null,
    contractEnd?: Date | null,
    npsScore?: number | null,
    csatScore?: number | null,
    notes?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.company = company;
    this.industry = industry;
    this.status = status || 'active';
    this.ltv = ltv || 0;
    this.cac = cac || 0;
    this.mrr = mrr || 0;
    this.contractStart = contractStart || null;
    this.contractEnd = contractEnd || null;
    this.npsScore = npsScore || null;
    this.csatScore = csatScore || null;
    this.notes = notes || '';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string {
    return this.phone;
  }

  getCompany(): string {
    return this.company;
  }

  getIndustry(): string {
    return this.industry;
  }

  getStatus(): string {
    return this.status;
  }

  getLtv(): number {
    return this.ltv;
  }

  getCac(): number {
    return this.cac;
  }

  getMrr(): number {
    return this.mrr;
  }

  getContractStart(): Date | null {
    return this.contractStart;
  }

  getContractEnd(): Date | null {
    return this.contractEnd;
  }

  getNpsScore(): number | null {
    return this.npsScore;
  }

  getCsatScore(): number | null {
    return this.csatScore;
  }

  getNotes(): string {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  setEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.updatedAt = new Date();
  }

  setCompany(company: string): void {
    this.company = company;
    this.updatedAt = new Date();
  }

  setIndustry(industry: string): void {
    this.industry = industry;
    this.updatedAt = new Date();
  }

  setStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setLtv(ltv: number): void {
    this.ltv = ltv;
    this.updatedAt = new Date();
  }

  setCac(cac: number): void {
    this.cac = cac;
    this.updatedAt = new Date();
  }

  setMrr(mrr: number): void {
    this.mrr = mrr;
    this.updatedAt = new Date();
  }

  setContractStart(date: Date | null): void {
    this.contractStart = date;
    this.updatedAt = new Date();
  }

  setContractEnd(date: Date | null): void {
    this.contractEnd = date;
    this.updatedAt = new Date();
  }

  setNpsScore(score: number | null): void {
    this.npsScore = score;
    this.updatedAt = new Date();
  }

  setCsatScore(score: number | null): void {
    this.csatScore = score;
    this.updatedAt = new Date();
  }

  setNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
