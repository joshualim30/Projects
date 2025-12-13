import { useState, useEffect } from 'react';
import { Button, Input, Table, TableHeader, TableColumn, TableBody, Tabs, Tab, Card, CardBody, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc, getDocs, query } from 'firebase/firestore';
import { LogOut, CreditCard, CalendarClock, Mail, Lock, UserPlus, Ruler, Weight, User as UserIcon } from 'lucide-react';

interface PlayerProfile {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    height: string;
    weight: string;
    position: string;
}

const CustomerPortal = () => {
    const [user, setUser] = useState<User | null>(null);
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Add Player Form State
    const [newPlayer, setNewPlayer] = useState({ firstName: '', lastName: '', dob: '', height: '', weight: '', position: '' });
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchPlayers(currentUser.uid);
            } else {
                setPlayers([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchPlayers = async (uid: string) => {
        try {
            const q = query(collection(db, `customers/${uid}/players`));
            const querySnapshot = await getDocs(q);
            const fetchedPlayers: PlayerProfile[] = [];
            querySnapshot.forEach((doc) => {
                fetchedPlayers.push({ id: doc.id, ...doc.data() } as PlayerProfile);
            });
            setPlayers(fetchedPlayers);
        } catch (err) {
            console.error("Error fetching players:", err);
        }
    };

    const handleAuth = async () => {
        const auth = getAuth();
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'customers', cred.user.uid), {
                    email: email,
                    createdAt: serverTimestamp(),
                    role: 'customer'
                });
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const handleAddPlayer = async () => {
        if (!user) return;
        try {
            await addDoc(collection(db, `customers/${user.uid}/players`), {
                ...newPlayer,
                createdAt: serverTimestamp()
            });
            setIsAddPlayerOpen(false);
            setNewPlayer({ firstName: '', lastName: '', dob: '', height: '', weight: '', position: '' });
            fetchPlayers(user.uid); // Refresh list
        } catch (err) {
            console.error("Error adding player:", err);
        }
    };

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth);
    };

    if (loading) return null;

    if (!user) {
        return (
            <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            Customer Portal
                        </h1>
                        <p className="text-gray-400 mt-2">Manage your training journey.</p>
                    </div>

                    <Card className="bg-zinc-900 border border-white/10 p-4">
                        <CardBody className="gap-4">
                            <Tabs
                                fullWidth
                                aria-label="Auth Options"
                                selectedKey={isLogin ? "login" : "signup"}
                                onSelectionChange={(key) => setIsLogin(key === "login")}
                            >
                                <Tab key="login" title="Sign In" />
                                <Tab key="signup" title="Sign Up" />
                            </Tabs>

                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                startContent={<Mail className="text-default-400" />}
                                value={email}
                                onValueChange={setEmail}
                            />
                            <Input
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                startContent={<Lock className="text-default-400" />}
                                value={password}
                                onValueChange={setPassword}
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <Button color="primary" className="font-bold w-full" onClick={handleAuth}>
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button color="primary" startContent={<UserPlus size={18} />} onPress={() => setIsAddPlayerOpen(true)}>
                            Add Player Profile
                        </Button>
                        <Button color="danger" variant="flat" startContent={<LogOut size={18} />} onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Players Section (New) */}
                    <section className="space-y-6 md:col-span-2">
                        <div className="flex items-center gap-3">
                            <UserIcon className="text-primary" />
                            <h2 className="text-2xl font-bold">Player Profiles</h2>
                        </div>
                        {players.length === 0 ? (
                            <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                                <p className="mb-4">No player profiles found. Please add a player to get started.</p>
                                <Button color="primary" onPress={() => setIsAddPlayerOpen(true)}>Create Profile</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {players.map(player => (
                                    <Card key={player.id} className="bg-zinc-900 border border-white/10">
                                        <CardBody>
                                            <h3 className="text-xl font-bold text-white">{player.firstName} {player.lastName}</h3>
                                            <p className="text-primary font-medium">{player.position}</p>
                                            <div className="text-gray-400 text-sm mt-2 space-y-1">
                                                <p>Height: {player.height}</p>
                                                <p>Weight: {player.weight}</p>
                                                <p>DOB: {player.dob}</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Active Bookings */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <CalendarClock className="text-primary" />
                            <h2 className="text-2xl font-bold">Your Schedule</h2>
                        </div>
                        <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                            <p className="mb-4">No upcoming training sessions booked.</p>
                            <Button color="primary" variant="ghost">Browse Events</Button>
                        </div>
                    </section>

                    {/* Payment History */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-primary" />
                            <h2 className="text-2xl font-bold">Payment History</h2>
                        </div>
                        <Table aria-label="Payment history" className="dark" removeWrapper>
                            <TableHeader>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn>DESCRIPTION</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No recent transactions."}>
                                {[]}
                            </TableBody>
                        </Table>
                    </section>
                </div>

                {/* Add Player Modal */}
                <Modal isOpen={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen} className="dark text-white">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add Player Profile</ModalHeader>
                                <ModalBody>
                                    <div className="flex gap-4">
                                        <Input label="First Name" value={newPlayer.firstName} onValueChange={(v) => setNewPlayer({ ...newPlayer, firstName: v })} />
                                        <Input label="Last Name" value={newPlayer.lastName} onValueChange={(v) => setNewPlayer({ ...newPlayer, lastName: v })} />
                                    </div>
                                    <Input type="date" label="Date of Birth" placeholder=" " value={newPlayer.dob} onValueChange={(v) => setNewPlayer({ ...newPlayer, dob: v })} />
                                    <div className="flex gap-4">
                                        <Input label="Height" placeholder="e.g. 6'2" value={newPlayer.height} onValueChange={(v) => setNewPlayer({ ...newPlayer, height: v })} startContent={<Ruler size={16} />} />
                                        <Input label="Weight" placeholder="e.g. 185 lbs" value={newPlayer.weight} onValueChange={(v) => setNewPlayer({ ...newPlayer, weight: v })} startContent={<Weight size={16} />} />
                                    </div>
                                    <Select label="Position" selectedKeys={newPlayer.position ? [newPlayer.position] : []} onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}>
                                        <SelectItem key="Point Guard" value="Point Guard">Point Guard</SelectItem>
                                        <SelectItem key="Shooting Guard" value="Shooting Guard">Shooting Guard</SelectItem>
                                        <SelectItem key="Small Forward" value="Small Forward">Small Forward</SelectItem>
                                        <SelectItem key="Power Forward" value="Power Forward">Power Forward</SelectItem>
                                        <SelectItem key="Center" value="Center">Center</SelectItem>
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={handleAddPlayer}>
                                        Save Profile
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default CustomerPortal;
