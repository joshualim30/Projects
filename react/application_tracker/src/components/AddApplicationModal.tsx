import React, { useState } from 'react';
import { X, Save, Building2, Briefcase, MapPin, Link as LinkIcon, RefreshCw, Plus, Image as ImageIcon, DollarSign } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { Application, ApplicationStatus } from '../types';

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Application | null;
}

export const AddApplicationModal = ({ isOpen, onClose, onSuccess, initialData }: AddApplicationModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company_name: '',
        company_location: '',
        company_website: '',
        company_logo: '',
        company_description: '',
        company_industry: '',
        company_size: '',
        position_description: '',
        salary_range: '',
        status: 'applied' as ApplicationStatus,
        application_date: new Date().toISOString().split('T')[0],
        notes: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        application_url: '',
        resume_version: '',
        cover_letter_version: '',
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                company_name: initialData.company_name || '',
                company_location: initialData.company_location || '',
                company_website: initialData.company_website || '',
                company_logo: initialData.company_logo || '',
                company_description: initialData.company_description || '',
                company_industry: initialData.company_industry || '',
                company_size: initialData.company_size || '',
                position_description: initialData.position_description || '',
                salary_range: initialData.salary_range || '',
                status: initialData.status || 'applied',
                application_date: initialData.application_date || new Date().toISOString().split('T')[0],
                notes: initialData.notes || '',
                contact_person: initialData.contact_person || '',
                contact_email: initialData.contact_email || '',
                contact_phone: initialData.contact_phone || '',
                application_url: initialData.application_url || '',
                resume_version: initialData.resume_version || '',
                cover_letter_version: initialData.cover_letter_version || '',
            });
        } else {
            setFormData({
                title: '',
                company_name: '',
                company_location: '',
                company_website: '',
                company_logo: '',
                company_description: '',
                company_industry: '',
                company_size: '',
                position_description: '',
                salary_range: '',
                status: 'applied' as ApplicationStatus,
                application_date: new Date().toISOString().split('T')[0],
                notes: '',
                contact_person: '',
                contact_email: '',
                contact_phone: '',
                application_url: '',
                resume_version: '',
                cover_letter_version: '',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const client = await getSupabaseClient();
        if (!client) {
            alert('Please configure Supabase in settings first.');
            setLoading(false);
            return;
        }

        const { error } = await client.from('applications').upsert([
            {
                ...formData,
                id: initialData?.id, // Ensure ID is present for update
                updated_at: new Date().toISOString(),
                created_at: initialData?.created_at || new Date().toISOString(),
            },
        ]);

        if (error) {
            alert(error.message);
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const InputField = ({ label, icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, icon?: React.ElementType }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />}
                <input
                    {...props}
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-medium shadow-inner`}
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
                            {initialData ? <Save className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                {initialData ? 'Edit Application' : 'New Opportunity'}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                {initialData ? 'Update application details' : 'Track a new job application'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                    <FormSection title="Core Details">
                        <InputField
                            required
                            label="Job Title"
                            icon={Briefcase}
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Senior Frontend Engineer"
                        />
                        <InputField
                            required
                            label="Company Name"
                            icon={Building2}
                            value={formData.company_name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_name: e.target.value })}
                            placeholder="e.g. Google"
                        />
                    </FormSection>

                    <FormSection title="Application Status">
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 ml-1">Current Status</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {(['applied', 'interview_scheduled', 'offer_received', 'rejected'] as const).map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${formData.status === status
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                                            }`}
                                    >
                                        {status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input
                            type="date"
                            value={formData.application_date}
                            onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500/50 w-full"
                        />
                    </FormSection>

                    <FormSection title="Additional Info">
                        <InputField
                            label="Location"
                            icon={MapPin}
                            value={formData.company_location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_location: e.target.value })}
                            placeholder="e.g. Remote / New York"
                        />
                        <InputField
                            label="Salary Range"
                            icon={DollarSign}
                            value={formData.salary_range}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary_range: e.target.value })}
                            placeholder="e.g. $120k - $150k"
                        />
                        <InputField
                            label="Application URL"
                            icon={LinkIcon}
                            value={formData.application_url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, application_url: e.target.value })}
                            placeholder="https://..."
                        />
                        <InputField
                            label="Company Logo"
                            icon={ImageIcon}
                            value={formData.company_logo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_logo: e.target.value })}
                            placeholder="https://..."
                        />
                    </FormSection>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Add any specific notes about the role..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm font-medium"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all text-xs uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 shadow-lg shadow-white/10 active:scale-95 transition-all disabled:opacity-50 text-xs uppercase tracking-wider"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Application
                    </button>
                </div>
            </div>
        </div>
    );
};
