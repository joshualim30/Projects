import React, { useState } from 'react';
import { X, Save, CheckCircle2, Building2, MapPin, Briefcase, DollarSign, FileText, Link as LinkIcon, Image as ImageIcon, RefreshCw } from 'lucide-react';
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
        salary_min: '',
        salary_max: '',
        currency: 'USD',
        locations: '',
        rejection_source: 'them' as 'me' | 'them',
        rejection_reason: '',
        status: 'applied' as ApplicationStatus,
        application_date: new Date().toISOString().split('T')[0],
        notes: '',
        contact_person: '',
        contact_email: '',
        application_url: '',
        resume_version: '',
        cover_letter_version: '',
        interview_stages: [] as any[], // { name, date, completed, notes }
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
                salary_min: initialData.salary_min?.toString() || '',
                salary_max: initialData.salary_max?.toString() || '',
                currency: initialData.currency || 'USD',
                locations: initialData.locations?.join(', ') || '',
                status: initialData.status || 'applied',
                rejection_source: initialData.rejection_source || 'them',
                rejection_reason: initialData.rejection_reason || '',
                interview_stages: initialData.interview_stages || [],
                application_date: initialData.application_date || new Date().toISOString().split('T')[0],
                notes: initialData.notes || '',
                contact_person: initialData.contact_person || '',
                contact_email: initialData.contact_email || '',
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
                salary_min: '',
                salary_max: '',
                currency: 'USD',
                locations: '',
                status: 'applied' as ApplicationStatus,
                rejection_source: 'them',
                rejection_reason: '',
                interview_stages: [],
                application_date: new Date().toISOString().split('T')[0],
                notes: '',
                contact_person: '',
                contact_email: '',
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

        let error;

        if (initialData?.id) {
            // Update existing
            const { error: updateError } = await client.from('applications').upsert([
                {
                    ...formData,
                    id: initialData.id,
                    salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
                    salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
                    locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
                    updated_at: new Date().toISOString(),
                    created_at: initialData.created_at, // Keep original created_at
                },
            ]);
            error = updateError;
        } else {
            // Create new (let DB generate ID)
            const { error: insertError } = await client.from('applications').insert([
                {
                    ...formData,
                    salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
                    salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
                    locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                },
            ]);
            error = insertError;
        }

        if (error) {
            alert(error.message);
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

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
                            className="md:col-span-2"
                        />
                        <InputField
                            label="Specific Locations (comma separated)"
                            icon={MapPin}
                            value={formData.locations}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, locations: e.target.value })}
                            placeholder="e.g. NYC, London, Austin (will appear in list)"
                            className="md:col-span-2"
                        />
                    </FormSection>

                    {/* Interview Stages Editor */}
                    <FormSection title="Interview Process">
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <label className="text-xs font-bold text-slate-400 ml-1">Stages (Timeline)</label>
                            <div className="space-y-3">
                                {formData.interview_stages.map((stage, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-3 p-3 rounded-xl bg-white/5 border border-white/5 relative group">
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={stage.completed}
                                                onChange={(e) => {
                                                    const newStages = [...formData.interview_stages];
                                                    newStages[idx].completed = e.target.checked;
                                                    setFormData({ ...formData, interview_stages: newStages });
                                                }}
                                                className="w-4 h-4 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500/50"
                                            />
                                            <input
                                                value={stage.name}
                                                onChange={(e) => {
                                                    const newStages = [...formData.interview_stages];
                                                    newStages[idx].name = e.target.value;
                                                    setFormData({ ...formData, interview_stages: newStages });
                                                }}
                                                placeholder="Stage Name"
                                                className="bg-transparent border-none text-sm font-bold text-white focus:outline-none w-full"
                                            />
                                        </div>
                                        <input
                                            type="date"
                                            value={stage.date || ''}
                                            onChange={(e) => {
                                                const newStages = [...formData.interview_stages];
                                                newStages[idx].date = e.target.value;
                                                setFormData({ ...formData, interview_stages: newStages });
                                            }}
                                            className="bg-black/20 rounded-lg px-2 py-1 text-xs text-slate-300 border border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newStages = formData.interview_stages.filter((_, i) => i !== idx);
                                                setFormData({ ...formData, interview_stages: newStages });
                                            }}
                                            className="text-slate-500 hover:text-rose-400"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        interview_stages: [...formData.interview_stages, { name: 'New Stage', completed: false }]
                                    })}
                                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2"
                                >
                                    + Add Interview Stage
                                </button>
                            </div>
                        </div>

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
                            placeholder="e.g. $120k - $150k (Legacy)"
                        />
                        <div className="grid grid-cols-3 gap-4 md:col-span-2">
                            <InputField
                                label="Min Salary"
                                type="number"
                                icon={DollarSign}
                                value={formData.salary_min}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary_min: e.target.value })}
                                placeholder="Min"
                            />
                            <InputField
                                label="Max Salary"
                                type="number"
                                icon={DollarSign}
                                value={formData.salary_max}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, salary_max: e.target.value })}
                                placeholder="Max"
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-bold appearance-none"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="CAD">CAD ($)</option>
                                    <option value="SGD">SGD ($)</option>
                                </select>
                            </div>
                        </div>

                        {formData.status === 'rejected' && (
                            <div className="md:col-span-2 space-y-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <label className="text-xs font-black text-rose-400 uppercase tracking-widest">Rejection Details</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400">Source</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rejection_source: 'them' })}
                                                className={cn("px-3 py-2 rounded-lg text-xs font-bold border", formData.rejection_source === 'them' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-black/20 text-slate-500 border-white/10')}
                                            >
                                                They Rejected Me
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rejection_source: 'me' })}
                                                className={cn("px-3 py-2 rounded-lg text-xs font-bold border", formData.rejection_source === 'me' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-black/20 text-slate-500 border-white/10')}
                                            >
                                                I Rejected Them
                                            </button>
                                        </div>
                                    </div>
                                    <InputField
                                        label="Reason (Optional)"
                                        value={formData.rejection_reason}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, rejection_reason: e.target.value })}
                                        placeholder="e.g. Ghosted, Lowball, Culture"
                                    />
                                </div>
                            </div>
                        )}
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
        </div >
    );
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
