import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    iconColor?: string;
}

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
    iconColor = "text-indigo-400"
}: EmptyStateProps) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 animate-in fade-in duration-700 p-8",
            className
        )}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center border mb-2 shadow-2xl transition-all duration-500",
                    "bg-slate-950 border-slate-800 shadow-indigo-500/10 group-hover:scale-110",
                    // Dynamic color handling could be improved, but keeping simple for now
                    iconColor
                )}
            >
                <Icon className={cn("w-8 h-8 md:w-10 md:h-10", iconColor.replace('bg-', 'text-').replace('/10', '400').replace('border-', ''))} />
            </motion.div>

            <div className="space-y-3 max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-200 text-black rounded-xl font-bold transition-all shadow-xl shadow-white/10 active:scale-95 text-xs uppercase tracking-wider group border border-white/50"
                >
                    {actionLabel}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
};
