import { useEffect, useState } from 'react';
import { Card, CardBody, Image, Spinner, Chip } from "@nextui-org/react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import JoshuaPassing from "../assets/joshuaPassing.jpg";

interface Trainer {
    id: string;
    displayName: string;
    bio?: string;
    photoURL?: string;
    role?: string;
    specialties?: string[];
}

const OurStory = () => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const q = query(collection(db, "coaches"), where("role", "==", "coach"));
                const querySnapshot = await getDocs(q);
                const fetchedTrainers: Trainer[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedTrainers.push({ id: doc.id, ...doc.data() } as Trainer);
                });

                if (fetchedTrainers.length === 0) {
                    // Fallback to Joshua Lim if DB is empty
                    setTrainers([{
                        id: 'default-1',
                        displayName: 'Joshua Lim',
                        role: 'Founder & Head Coach',
                        bio: "Hi, I am Joshua Lim, the Founder and current Head Coach for Team Wave! I started playing basketball when I was just two years old, and have had the amazing opportunity to be trained by some of the greats as well as play at some of the highest levels. I started Team Wave to give a coaching experience I wish I had during my time on the court.",
                        photoURL: JoshuaPassing,
                        specialties: ['Guard Play', 'Shooting', 'IQ Development']
                    }]);
                } else {
                    setTrainers(fetchedTrainers);
                }
            } catch (err) {
                console.error("Error fetching trainers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className='min-h-screen text-white p-6 md:p-20'>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-4">
                        Meet Our Trainers
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Dedicated professionals committed to elevating your game to the next level.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {trainers.map((trainer) => (
                        <Card key={trainer.id} className="bg-zinc-900 border border-white/10 p-6">
                            <CardBody className="flex flex-col md:flex-row gap-6 items-start">
                                <Image
                                    src={trainer.photoURL || 'https://via.placeholder.com/150'}
                                    alt={trainer.displayName}
                                    className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl"
                                    isZoomed
                                />
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{trainer.displayName}</h2>
                                    <p className="text-primary font-medium mb-4">{trainer.role || 'Trainer'}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {trainer.specialties?.map((spec, i) => (
                                            <Chip key={i} size="sm" variant="flat" color="default">{spec}</Chip>
                                        ))}
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {trainer.bio || 'No bio available.'}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurStory;