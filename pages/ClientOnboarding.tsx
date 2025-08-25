
import React, { useState } from 'react';
import { Card, Input, Select, Button, PageTitle, Badge } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { Client, CivilStatus, ItemStatus, RiskCategory } from '../types';
import { generateId } from '../lib/utils';
import { BDO_BRANCHES, RELATIONSHIP_MANAGERS, OPTIONS, RISK_PROFILING_QUESTIONS, getRiskCategoryFromScore } from '../constants';

const RiskProfilingStep: React.FC<{
    onComplete: (score: number, category: RiskCategory) => void;
}> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<{[key: number]: number}>({});
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const riskCategory = getRiskCategoryFromScore(totalScore);

    const handleAnswer = (questionId: number, score: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: score }));
    };

    const isComplete = Object.keys(answers).length === RISK_PROFILING_QUESTIONS.length;

    return (
        <div>
            <h3 className="text-xl font-semibold text-bdo-dark-blue mb-4">Client Risk Profiling</h3>
            <div className="space-y-6">
                {RISK_PROFILING_QUESTIONS.map(q => (
                    <div key={q.id}>
                        <p className="font-medium text-gray-800">{q.id}. {q.question}</p>
                        <div className="mt-2 space-y-2">
                            {q.options.map(opt => (
                                <label key={opt.text} className="flex items-center p-2 border rounded-md has-[:checked]:bg-bdo-light-blue/10 has-[:checked]:border-bdo-light-blue">
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        className="h-4 w-4 text-bdo-blue focus:ring-bdo-light-blue border-gray-300"
                                        onChange={() => handleAnswer(q.id, opt.score)}
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{opt.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isComplete && (
                 <Card className="mt-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Calculated Score</p>
                            <p className="text-2xl font-bold text-bdo-dark-blue">{totalScore}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Risk Category</p>
                            <Badge color={riskCategory === 'Conservative' ? 'green' : riskCategory === 'Moderate' ? 'yellow' : 'red'}>
                                {riskCategory}
                            </Badge>
                        </div>
                    </div>
                </Card>
            )}
            <div className="mt-6 flex justify-end">
                <Button onClick={() => onComplete(totalScore, riskCategory)} disabled={!isComplete}>
                    Confirm Risk Profile & Finish
                </Button>
            </div>
        </div>
    );
};


const ClientOnboarding: React.FC = () => {
    const { state, dispatch } = useStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Client>>({
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        tin: '123-456-789-000',
        dob: '1980-07-15',
        branchCode: 'BR001 - Makati Main',
        relationshipManager: 'Maria Santos',
        email: 'juan.delacruz@sample.com',
        phone: '09171234567',
        nationality: 'Filipino',
        civilStatus: CivilStatus.MARRIED,
        occupation: 'Engineer',
        address: '123 Ayala Ave, Makati',
        documents: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(2);
    
    const handleRiskProfileComplete = (score: number, category: RiskCategory) => {
        const finalClientData: Client = {
            ...formData,
            clientId: generateId('C'),
            riskProfileScore: score,
            riskCategory: category,
            status: ItemStatus.PENDING,
            submittedAt: new Date().toISOString(),
            submittedBy: state.currentUser.name,
        } as Client;

        dispatch({ type: 'ADD_CLIENT', payload: finalClientData });
        alert('Client onboarding submitted for approval!');
        // Ideally, navigate away or reset form
        setStep(1);
        setFormData({});
    };

    return (
        <div>
            <PageTitle title="Client Onboarding" />
            <Card>
                {step === 1 && (
                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Input label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
                            <Input label="Middle Name" name="middleName" value={formData.middleName || ''} onChange={handleChange} />
                            <Input label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
                            <Input label="TIN" name="tin" value={formData.tin || ''} onChange={handleChange} required />
                            <Input label="Date of Birth" name="dob" type="date" value={formData.dob || ''} onChange={handleChange} required />
                            <Select label="Civil Status" name="civilStatus" value={formData.civilStatus || ''} onChange={handleChange} required>
                                {OPTIONS.civilStatus.map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                            <Input label="Nationality" name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
                            <Input label="Occupation" name="occupation" value={formData.occupation || ''} onChange={handleChange} required />
                            <Input label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                            <Input label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleChange} required />
                            <Input label="Address" name="address" value={formData.address || ''} onChange={handleChange} className="md:col-span-2" />
                            <Select label="Branch" name="branchCode" value={formData.branchCode || ''} onChange={handleChange} required>
                                {BDO_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                            </Select>
                            <Select label="Relationship Manager" name="relationshipManager" value={formData.relationshipManager || ''} onChange={handleChange} required>
                                {RELATIONSHIP_MANAGERS.map(rm => <option key={rm} value={rm}>{rm}</option>)}
                            </Select>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documents</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-bdo-blue hover:text-bdo-dark-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-bdo-light-blue"><span>Upload files</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple /></label><p className="pl-1">or drag and drop</p></div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button type="submit">Proceed to Risk Profiling</Button>
                        </div>
                    </form>
                )}
                {step === 2 && (
                    <RiskProfilingStep onComplete={handleRiskProfileComplete} />
                )}
            </Card>
        </div>
    );
};

export default ClientOnboarding;
