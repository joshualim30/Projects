import { Button } from '@nextui-org/react';
import { Plus, Users, Calendar, TrendingUp } from 'lucide-react';

const TrainingDashboard = () => {
    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Training Dashboard</h1>
                    <p className="text-gray-400 mt-2">Manage sessions, track progress, and analyze performance.</p>
                </div>
                <Button color="primary" className="font-bold shadow-lg shadow-primary/20" startContent={<Plus className="w-5 h-5" />}>
                    New Session
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-full text-gray-400">Total</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Active Sessions</h3>
                    <p className="text-3xl font-bold mt-1 text-white">0</p>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                            <Users className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-full text-green-500">+0%</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Athletes</h3>
                    <p className="text-3xl font-bold mt-1 text-white">0</p>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-full text-purple-500">+0%</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Monthly Revenue</h3>
                    <p className="text-3xl font-bold mt-1 text-white">$0</p>
                </div>
            </div>

            <section className="bg-zinc-900/30 rounded-3xl border border-white/5 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="bg-zinc-900 p-4 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Training Sessions</h3>
                <p className="text-gray-500 max-w-sm mb-6">Get started by creating your first training program or session for athletes to book.</p>
                <Button color="primary" variant="flat" startContent={<Plus className="w-4 h-4" />}>
                    Create First Session
                </Button>
            </section>
        </div>
    );
};

export default TrainingDashboard;
