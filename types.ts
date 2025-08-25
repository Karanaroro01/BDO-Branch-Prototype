
export enum CivilStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  WIDOWED = 'Widowed',
  SEPARATED = 'Separated',
}

export enum AccountType {
  IMA = 'IMA',
  UITF = 'UITF',
}

export enum HoldingType {
  SINGLE = 'Single',
  JOINT = 'Joint',
  IN_TRUST = 'In Trust For',
}

export enum RiskCategory {
  CONSERVATIVE = 'Conservative',
  MODERATE = 'Moderate',
  AGGRESSIVE = 'Aggressive',
  BALANCED = 'Balanced',
}

export enum ApplicationType {
  BUY = 'Buy',
  SELL = 'Sell',
}

export enum InstrumentType {
    CASH = 'Cash',
    CASA = 'CASA',
    CHECK = 'Check',
}

export enum ItemStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED = 'Closed'
}

export enum SIPType {
    SIP = 'SIP',
    SWP = 'SWP'
}

export enum Frequency {
    MONTHLY = 'Monthly',
    QUARTERLY = 'Quarterly'
}

export interface Document {
  name: string;
  file: File | null;
  url: string;
}

export interface Client {
  clientId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  tin: string;
  dob: string;
  civilStatus: CivilStatus;
  nationality: string;
  occupation: string;
  email: string;
  phone: string;
  address: string;
  relationshipManager: string;
  branchCode: string;
  riskProfileScore: number;
  riskCategory: RiskCategory;
  documents: Document[];
  status: ItemStatus;
  submittedAt: string;
  approvedAt?: string;
  submittedBy: string;
  approvedBy?: string;
}

export interface Account {
  accountId: string;
  clientId: string;
  accountType: AccountType;
  holdingType: HoldingType;
  fundName: string;
  fundCategory: string;
  riskLevel: RiskCategory;
  balance: number;
  openDate: string;
  status: ItemStatus;
  submittedAt: string;
  approvedAt?: string;
  submittedBy: string;
  approvedBy?: string;
}

export interface Application {
  applicationId: string;
  clientId: string;
  accountId: string;
  type: ApplicationType;
  amount: number;
  fund: string;
  instrumentType: InstrumentType;
  submittedBy: string;
  status: ItemStatus;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  waiverAttached?: boolean;
}

export interface SIPPlan {
  sipId: string;
  clientId: string;
  accountId: string;
  type: SIPType;
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
  stepUpEnabled: boolean;
  stepUpPercent: number;
  expectedReturn: number;
  status: ItemStatus;
  createdBy: string;
  approvedBy?: string;
  submittedAt: string;
  approvedAt?: string;
}

export enum ApprovalType {
    CLIENT = 'Client Onboarding',
    ACCOUNT = 'New Account',
    APPLICATION = 'Application',
    SIP = 'SIP/SWP Plan'
}

export interface ApprovalItem {
    id: string;
    type: ApprovalType;
    itemId: string;
    details: string;
    submittedBy: string;
    submittedAt: string;
    status: ItemStatus;
    data: Client | Account | Application | SIPPlan;
}

export interface RiskQuestion {
    id: number;
    question: string;
    options: { text: string; score: number }[];
}