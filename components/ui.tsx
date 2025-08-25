import React, { ReactNode } from 'react';
import { RiskCategory } from '../types';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}
export const Card: React.FC<CardProps> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {title && <h3 className="text-lg font-bold text-bdo-dark-blue mb-4">{title}</h3>}
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-black mb-1">{label}</label>}
    <input id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bdo-light-blue focus:border-bdo-light-blue sm:text-sm" />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}
export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-black mb-1">{label}</label>
    <select id={id} {...props} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-bdo-light-blue focus:border-bdo-light-blue sm:text-sm">
      {children}
    </select>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "text-white bg-bdo-blue hover:bg-bdo-dark-blue focus:ring-bdo-blue",
        secondary: "text-bdo-dark-blue bg-bdo-gold hover:bg-yellow-400 focus:ring-bdo-gold",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    }
    return <button {...props} className={`${baseClasses} ${variantClasses[variant]}`}>{children}</button>
}

interface BadgeProps {
    children: ReactNode;
    color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}
export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        red: 'bg-red-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
            {children}
        </span>
    );
};

export const RiskBadge: React.FC<{ risk: RiskCategory }> = ({ risk }) => {
    const colorMap = {
        [RiskCategory.CONSERVATIVE]: 'green',
        [RiskCategory.MODERATE]: 'yellow',
        [RiskCategory.BALANCED]: 'blue',
        [RiskCategory.AGGRESSIVE]: 'red',
    } as const;
    return <Badge color={colorMap[risk]}>{risk}</Badge>;
}

interface TableProps {
    headers: string[];
    children: ReactNode;
}
export const Table: React.FC<TableProps> = ({ headers, children }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {children}
                </tbody>
            </table>
        </div>
    );
};

interface PageTitleProps {
    title: string;
    children?: ReactNode;
}
export const PageTitle: React.FC<PageTitleProps> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-bdo-dark-blue">{title}</h1>
        <div>{children}</div>
    </div>
);
