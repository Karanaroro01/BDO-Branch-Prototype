
import { Client, Account, Application, SIPPlan, ApprovalItem, RiskCategory, AccountType, HoldingType, CivilStatus, ApplicationType, InstrumentType, ItemStatus, SIPType, Frequency, ApprovalType } from '../types';
import { generateId } from '../lib/utils';

const createInitialClients = (): Client[] => {
    const clients: Client[] = [
        {
            clientId: 'C-1672531200000',
            firstName: 'Juan',
            middleName: 'Reyes',
            lastName: 'Dela Cruz',
            tin: '123-456-789-000',
            dob: '1980-07-15',
            civilStatus: CivilStatus.MARRIED,
            nationality: 'Filipino',
            occupation: 'Software Engineer',
            email: 'juan.delacruz@sample.com',
            phone: '09171234567',
            address: '123 Makati Ave, Makati City',
            relationshipManager: 'Maria Santos',
            branchCode: 'BR001 - Makati Main',
            riskProfileScore: 62,
            riskCategory: RiskCategory.MODERATE,
            documents: [
                { name: 'Valid ID', file: null, url: 'id.pdf' },
                { name: 'Proof of Address', file: null, url: 'address.pdf' },
                { name: 'Signature Card', file: null, url: 'signature.pdf' },
            ],
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 29)).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        },
        {
            clientId: 'C-1672617600000',
            firstName: 'Maria',
            middleName: 'Lim',
            lastName: 'Clara',
            tin: '987-654-321-000',
            dob: '1992-03-22',
            civilStatus: CivilStatus.SINGLE,
            nationality: 'Filipino',
            occupation: 'Doctor',
            email: 'maria.clara@sample.com',
            phone: '09187654321',
            address: '456 Ortigas Ave, Pasig City',
            relationshipManager: 'John Reyes',
            branchCode: 'BR002 - Ortigas Center',
            riskProfileScore: 85,
            riskCategory: RiskCategory.AGGRESSIVE,
            documents: [{ name: 'Valid ID', file: null, url: 'id.pdf' },
                { name: 'Proof of Address', file: null, url: 'address.pdf' },
                { name: 'Signature Card', file: null, url: 'signature.pdf' },],
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 24)).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        },
        {
            clientId: 'C-1672704000000',
            firstName: 'Andres',
            middleName: 'Santos',
            lastName: 'Bonifacio',
            tin: '111-222-333-000',
            dob: '1975-11-30',
            civilStatus: CivilStatus.WIDOWED,
            nationality: 'Filipino',
            occupation: 'Business Owner',
            email: 'andres.bonifacio@sample.com',
            phone: '09201112222',
            address: '789 BGC High Street, Taguig',
            relationshipManager: 'Anna Lim',
            branchCode: 'BR004 - BGC High Street',
            riskProfileScore: 30,
            riskCategory: RiskCategory.CONSERVATIVE,
            documents: [],
            status: ItemStatus.PENDING,
            submittedAt: new Date().toISOString(),
            submittedBy: 'Maker Juan',
        }
    ];
    
    // Add 7 more clients for a total of 10
    for (let i = 3; i < 10; i++) {
        clients.push({
            clientId: `C-${1672704000000 + i * 86400000}`,
            firstName: `ClientFirst${i}`,
            middleName: `ClientMid${i}`,
            lastName: `ClientLast${i}`,
            tin: `111-222-333-00${i}`,
            dob: `${1980+i}-01-01`,
            civilStatus: CivilStatus.SINGLE,
            nationality: 'Filipino',
            occupation: 'Employee',
            email: `client${i}@sample.com`,
            phone: `0920111222${i}`,
            address: `${i} Sample St, Quezon City`,
            relationshipManager: 'Peter Garcia',
            branchCode: 'BR005 - Alabang Town Center',
            riskProfileScore: 50 + (i*5),
            riskCategory: RiskCategory.MODERATE,
            documents: [],
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - (10-i))).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - (9-i))).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        });
    }

    return clients;
};

const createInitialAccounts = (clients: Client[]): Account[] => {
    return [
        {
            accountId: 'UA-987654',
            clientId: clients[0].clientId,
            accountType: AccountType.UITF,
            holdingType: HoldingType.SINGLE,
            fundName: 'BDO Peso Bond Fund',
            fundCategory: 'Fixed Income',
            riskLevel: RiskCategory.CONSERVATIVE,
            balance: 500000,
            openDate: '2023-01-15',
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 27)).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        },
        {
            accountId: 'UA-987655',
            clientId: clients[0].clientId,
            accountType: AccountType.UITF,
            holdingType: HoldingType.SINGLE,
            fundName: 'BDO Equity Fund',
            fundCategory: 'Equity',
            riskLevel: RiskCategory.AGGRESSIVE,
            balance: 750000,
            openDate: '2023-02-20',
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 19)).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        },
        {
            accountId: 'UA-987656',
            clientId: clients[1].clientId,
            accountType: AccountType.IMA,
            holdingType: HoldingType.SINGLE,
            fundName: 'IMA - Philippine Equities',
            fundCategory: 'Equity',
            riskLevel: RiskCategory.AGGRESSIVE,
            balance: 2000000,
            openDate: '2023-03-10',
            status: ItemStatus.ACTIVE,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
            submittedBy: 'Maker Juan',
            approvedBy: 'Approver Jane'
        },
        {
            accountId: 'UA-987657',
            clientId: clients[2].clientId,
            accountType: AccountType.UITF,
            holdingType: HoldingType.SINGLE,
            fundName: 'BDO Money Market Fund',
            fundCategory: 'Money Market',
            riskLevel: RiskCategory.CONSERVATIVE,
            balance: 1000000,
            openDate: '2024-05-10',
            status: ItemStatus.PENDING,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
            submittedBy: 'Maker Juan',
        },
    ];
};

const createInitialApplications = (clients: Client[], accounts: Account[]): Application[] => {
    return [
        {
            applicationId: generateId('T'),
            clientId: clients[0].clientId,
            accountId: accounts[0].accountId,
            type: ApplicationType.BUY,
            amount: 100000,
            fund: 'BDO Peso Bond Fund',
            instrumentType: InstrumentType.CASA,
            submittedBy: 'Maker Juan',
            status: ItemStatus.APPROVED,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
            approvedBy: 'Approver Jane'
        },
        {
            applicationId: generateId('T'),
            clientId: clients[0].clientId,
            accountId: accounts[1].accountId,
            type: ApplicationType.SELL,
            amount: 50000,
            fund: 'BDO Equity Fund',
            instrumentType: InstrumentType.CASA,
            submittedBy: 'Maker Juan',
            status: ItemStatus.APPROVED,
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
            approvedBy: 'Approver Jane'
        },
        {
            applicationId: generateId('T'),
            clientId: clients[1].clientId,
            accountId: accounts[2].accountId,
            type: ApplicationType.BUY,
            amount: 600000,
            fund: 'IMA - Philippine Equities',
            instrumentType: InstrumentType.CASH,
            submittedBy: 'Maker Juan',
            status: ItemStatus.PENDING,
            submittedAt: new Date().toISOString(),
        }
    ];
};

const createInitialSIPs = (clients: Client[], accounts: Account[]): SIPPlan[] => {
    return [
        {
            sipId: generateId('SIP'),
            clientId: clients[0].clientId,
            accountId: accounts[0].accountId,
            type: SIPType.SIP,
            amount: 10000,
            frequency: Frequency.MONTHLY,
            startDate: '2024-01-01',
            endDate: '2034-01-01',
            stepUpEnabled: true,
            stepUpPercent: 10,
            expectedReturn: 8,
            status: ItemStatus.ACTIVE,
            createdBy: 'Maker Juan',
            approvedBy: 'Approver Jane',
            submittedAt: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
            approvedAt: new Date(new Date().setDate(new Date().getDate() - 39)).toISOString(),
        },
        {
            sipId: generateId('SIP'),
            clientId: clients[1].clientId,
            accountId: accounts[2].accountId,
            type: SIPType.SIP,
            amount: 25000,
            frequency: Frequency.MONTHLY,
            startDate: '2024-06-01',
            endDate: '2044-06-01',
            stepUpEnabled: false,
            stepUpPercent: 0,
            expectedReturn: 6,
            status: ItemStatus.PENDING,
            createdBy: 'Maker Juan',
            submittedAt: new Date().toISOString(),
        }
    ];
};

const createInitialApprovals = (clients: Client[], accounts: Account[], applications: Application[], sips: SIPPlan[]): ApprovalItem[] => {
    const pendingClient = clients.find(c => c.status === ItemStatus.PENDING);
    const pendingAccount = accounts.find(a => a.status === ItemStatus.PENDING);
    const pendingApplication = applications.find(t => t.status === ItemStatus.PENDING);
    const pendingSip = sips.find(s => s.status === ItemStatus.PENDING);

    const approvals: ApprovalItem[] = [];

    if (pendingClient) {
        approvals.push({
            id: generateId('APP'),
            type: ApprovalType.CLIENT,
            itemId: pendingClient.clientId,
            details: `New client: ${pendingClient.firstName} ${pendingClient.lastName}`,
            submittedBy: pendingClient.submittedBy,
            submittedAt: pendingClient.submittedAt,
            status: ItemStatus.PENDING,
            data: pendingClient
        });
    }
    if (pendingAccount) {
        const client = clients.find(c => c.clientId === pendingAccount.clientId);
        approvals.push({
            id: generateId('APP'),
            type: ApprovalType.ACCOUNT,
            itemId: pendingAccount.accountId,
            details: `New ${pendingAccount.accountType} for ${client?.firstName} ${client?.lastName}`,
            submittedBy: pendingAccount.submittedBy,
            submittedAt: pendingAccount.submittedAt,
            status: ItemStatus.PENDING,
            data: pendingAccount
        });
    }
    if (pendingApplication) {
        const client = clients.find(c => c.clientId === pendingApplication.clientId);
        approvals.push({
            id: generateId('APP'),
            type: ApprovalType.APPLICATION,
            itemId: pendingApplication.applicationId,
            details: `${pendingApplication.type} ${pendingApplication.amount} for ${client?.firstName} ${client?.lastName}`,
            submittedBy: pendingApplication.submittedBy,
            submittedAt: pendingApplication.submittedAt,
            status: ItemStatus.PENDING,
            data: pendingApplication
        });
    }
    if (pendingSip) {
        const client = clients.find(c => c.clientId === pendingSip.clientId);
        approvals.push({
            id: generateId('APP'),
            type: ApprovalType.SIP,
            itemId: pendingSip.sipId,
            details: `New ${pendingSip.type} Plan for ${client?.firstName} ${client?.lastName}`,
            submittedBy: pendingSip.createdBy,
            submittedAt: pendingSip.submittedAt,
            status: ItemStatus.PENDING,
            data: pendingSip
        });
    }

    return approvals;
};


export const initialClients = createInitialClients();
export const initialAccounts = createInitialAccounts(initialClients);
export const initialApplications = createInitialApplications(initialClients, initialAccounts);
export const initialSips = createInitialSIPs(initialClients, initialAccounts);
export const initialApprovals = createInitialApprovals(initialClients, initialAccounts, initialApplications, initialSips);