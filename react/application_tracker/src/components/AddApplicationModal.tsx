import React, { useState } from 'react';
import { X, Save, CheckCircle2, Building2, MapPin, Globe, Briefcase, DollarSign, FileText } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { Application, ApplicationStatus } from '../types';
import { cn } from '../lib/utils';

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
            <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1 opacity-80">
                <span className="w-6 h-px bg-indigo-500/50"></span>
                {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {children}
            </div>
        </div>
    );

    const InputField = ({ label, icon: Icon, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, icon?: React.ElementType }) => (
        <div className={cn("space-y-2", className)}>
            <label className="text-xs font-bold text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" />}
                <input
                    {...props}
                    className={`w-full bg-black/20 border border-white/10 rounded-xl ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-medium shadow-inner backdrop-blur-sm hover:border-white/20`}
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/80 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="glass-card w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 border border-white/10 relative overflow-hidden ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0 backdrop-blur-xl z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-px shadow-lg shadow-indigo-500/20">
                            <div className="w-full h-full rounded-[15px] bg-app-card flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-50" />
                                {initialData ? <Save className="w-6 h-6 text-indigo-400 relative z-10" /> : <CheckCircle2 className="w-6 h-6 text-indigo-400 relative z-10" />}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight glow-text block">
                                {initialData ? 'Edit Application' : 'New Opportunity'}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium tracking-wide mt-0.5">
                                {initialData ? 'Update application details' : 'Track a new job application'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                    <FormSection title="Core Details">
                        <InputField
                            required
                            label="Job Title"
                            icon={Briefcase}
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="md:col-span-2"
                        />
                        <InputField
                            required
                            label="Company Name"
                            icon={Building2}
                            value={formData.company_name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_name: e.target.value })}
                            placeholder="e.g. Google"
                        />
                        <InputField
                            label="Company Location"
                            icon={MapPin}
                            value={formData.company_location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_location: e.target.value })}
                            placeholder="e.g. Remote / New York"
                        />
                    </FormSection>

                    <FormSection title="Status & Details">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 ml-1">Current Status</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {(['applied', 'interview_scheduled', 'offer_received', 'rejected'] as const).map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center justify-center text-center",
                                            formData.status === status
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/10'
                                        )}
                                    >
                                        {status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 ml-1">Date Applied</label>
                            <input
                                type="date"
                                value={formData.application_date}
                                onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner backdrop-blur-sm"
                            />
                        </div>

                        <InputField
                            label="Salary Range"
                            icon={DollarSign}
                            value={formData.salary_range}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary_range: e.target.value })}
                            placeholder="e.g. $120k - $150k"
                        />
                    </FormSection>

                    <FormSection title="Links & Assets">
                        <InputField
                            label="Application URL"
                            icon={LinkIcon}
                            value={formData.application_url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, application_url: e.target.value })}
                            placeholder="https://linkedin.com/jobs/..."
                        />
                        <InputField
                            label="Company Logo URL"
                            icon={ImageIcon}
                            value={formData.company_logo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company_logo: e.target.value })}
                            placeholder="https://logo.clearbit.com/..."
                        />
                        <InputField
                            label="Resume Version"
                            icon={FileText}
                            value={formData.resume_version}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, resume_version: e.target.value })}
                            placeholder="e.g. v2_Frontend_Focus"
                        />
                    </FormSection>

                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-400 ml-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            placeholder="Add any specific notes about the role, interview process, or thoughts..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm font-medium shadow-inner backdrop-blur-sm hover:border-white/20"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 flex gap-4 backdrop-blur-xl z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-4 rounded-xl bg-transparent border border-white/10 text-slate-400 font-bold hover:bg-white/5 hover:text-white transition-all text-sm uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-2 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-black font-black hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm uppercase tracking-wider disabled:pointer-events-none"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Application
                    </button>
                </div>
            </div>
        </div>
    );
};
