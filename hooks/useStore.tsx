
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Client, Account, Application, SIPPlan, ApprovalItem, ItemStatus, ApprovalType } from '../types';
import { initialClients, initialAccounts, initialApplications, initialSips, initialApprovals } from '../data/mockData';
import { generateId } from '../lib/utils';

interface AppState {
  clients: Client[];
  accounts: Account[];
  applications: Application[];
  sipPlans: SIPPlan[];
  approvals: ApprovalItem[];
  currentUser: { name: string; role: 'Maker' | 'Approver' };
}

const initialState: AppState = {
  clients: initialClients,
  accounts: initialAccounts,
  applications: initialApplications,
  sipPlans: initialSips,
  approvals: initialApprovals,
  currentUser: { name: 'Maker Juan', role: 'Maker' },
};

type Action =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'ADD_SIP_PLAN'; payload: SIPPlan }
  | { type: 'APPROVE_ITEM'; payload: { approvalId: string; approver: string } }
  | { type: 'REJECT_ITEM'; payload: { approvalId: string; approver: string } };

const AppReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_CLIENT': {
      const newClient = { ...action.payload, status: ItemStatus.PENDING };
      const newApproval: ApprovalItem = {
        id: generateId('APP'),
        type: ApprovalType.CLIENT,
        itemId: newClient.clientId,
        details: `New Client: ${newClient.firstName} ${newClient.lastName}`,
        submittedBy: newClient.submittedBy,
        submittedAt: newClient.submittedAt,
        status: ItemStatus.PENDING,
        data: newClient,
      };
      return {
        ...state,
        clients: [...state.clients, newClient],
        approvals: [...state.approvals, newApproval],
      };
    }
    case 'ADD_ACCOUNT': {
       const newAccount = { ...action.payload, status: ItemStatus.PENDING };
       const client = state.clients.find(c => c.clientId === newAccount.clientId);
       const newApproval: ApprovalItem = {
         id: generateId('APP'),
         type: ApprovalType.ACCOUNT,
         itemId: newAccount.accountId,
         details: `New ${newAccount.accountType} for ${client?.firstName} ${client?.lastName}`,
         submittedBy: newAccount.submittedBy,
         submittedAt: newAccount.submittedAt,
         status: ItemStatus.PENDING,
         data: newAccount,
       };
       return {
         ...state,
         accounts: [...state.accounts, newAccount],
         approvals: [...state.approvals, newApproval],
       };
    }
     case 'ADD_APPLICATION': {
       const newApplication = { ...action.payload, status: ItemStatus.PENDING };
       const client = state.clients.find(c => c.clientId === newApplication.clientId);
       const newApproval: ApprovalItem = {
         id: generateId('APP'),
         type: ApprovalType.APPLICATION,
         itemId: newApplication.applicationId,
         details: `${newApplication.type} ${newApplication.amount} for ${client?.firstName} ${client?.lastName}`,
         submittedBy: newApplication.submittedBy,
         submittedAt: newApplication.submittedAt,
         status: ItemStatus.PENDING,
         data: newApplication,
       };
       return {
         ...state,
         applications: [...state.applications, newApplication],
         approvals: [...state.approvals, newApproval],
       };
    }
    case 'ADD_SIP_PLAN': {
      const newSipPlan = { ...action.payload, status: ItemStatus.PENDING };
      const client = state.clients.find(c => c.clientId === newSipPlan.clientId);
      const newApproval: ApprovalItem = {
        id: generateId('APP'),
        type: ApprovalType.SIP,
        itemId: newSipPlan.sipId,
        details: `New ${newSipPlan.type} for ${client?.firstName} ${client?.lastName}`,
        submittedBy: newSipPlan.createdBy,
        submittedAt: newSipPlan.submittedAt,
        status: ItemStatus.PENDING,
        data: newSipPlan,
      };
      return {
        ...state,
        sipPlans: [...state.sipPlans, newSipPlan],
        approvals: [...state.approvals, newApproval],
      };
    }
    case 'APPROVE_ITEM': {
      const { approvalId, approver } = action.payload;
      const approval = state.approvals.find(a => a.id === approvalId);
      if (!approval) return state;

      const now = new Date().toISOString();
      const newState = { ...state };
      
      const updateItem = (items: any[], itemId: string) => {
          return items.map(item => item.clientId === itemId || item.accountId === itemId || item.applicationId === itemId || item.sipId === itemId ? { ...item, status: ItemStatus.ACTIVE, approvedAt: now, approvedBy: approver } : item
          );
      }

      switch (approval.type) {
        case ApprovalType.CLIENT:
          newState.clients = updateItem(state.clients, approval.itemId);
          break;
        case ApprovalType.ACCOUNT:
          newState.accounts = updateItem(state.accounts, approval.itemId);
          break;
        case ApprovalType.APPLICATION:
          newState.applications = updateItem(state.applications, approval.itemId);
          // Adjust account balance on application approval
          const app = state.applications.find(t => t.applicationId === approval.itemId);
          if (app) {
            newState.accounts = newState.accounts.map(acc => {
              if (acc.accountId === app.accountId) {
                const newBalance = app.type === 'Buy' ? acc.balance + app.amount : acc.balance - app.amount;
                return { ...acc, balance: newBalance };
              }
              return acc;
            });
          }
          break;
        case ApprovalType.SIP:
          newState.sipPlans = updateItem(state.sipPlans, approval.itemId);
          break;
      }

      return {
        ...newState,
        approvals: state.approvals.filter(a => a.id !== approvalId),
      };
    }
    case 'REJECT_ITEM': {
        const { approvalId, approver } = action.payload;
        const approval = state.approvals.find(a => a.id === approvalId);
        if (!approval) return state;

        const now = new Date().toISOString();
        const newState = { ...state };
        
        const updateItem = (items: any[], itemId: string) => {
            return items.map(item => item.clientId === itemId || item.accountId === itemId || item.applicationId === itemId || item.sipId === itemId ? { ...item, status: ItemStatus.REJECTED, approvedAt: now, approvedBy: approver } : item);
        }

        switch (approval.type) {
            case ApprovalType.CLIENT: newState.clients = updateItem(state.clients, approval.itemId); break;
            case ApprovalType.ACCOUNT: newState.accounts = updateItem(state.accounts, approval.itemId); break;
            case ApprovalType.APPLICATION: newState.applications = updateItem(state.applications, approval.itemId); break;
            case ApprovalType.SIP: newState.sipPlans = updateItem(state.sipPlans, approval.itemId); break;
        }

        return {
            ...newState,
            approvals: state.approvals.filter(a => a.id !== approvalId),
        };
    }
    default:
      return state;
  }
};

const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};