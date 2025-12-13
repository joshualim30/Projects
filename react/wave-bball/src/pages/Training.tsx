import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Card, CardHeader, CardBody, CardFooter, Image, Button, Spinner } from '@nextui-org/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

interface Session {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    level: string;
}

const Training = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "training_sessions"));
                const sessionData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
                setSessions(sessionData);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // Placeholder data if no sessions found (for marketing demo)
    const displaySessions = sessions.length > 0 ? sessions : [
        {
            id: '1',
            title: 'Elite Skills Training',
            description: 'Advanced ball handling, shooting mechanics, and game situational reads. Perfect for high school and college athletes.',
            price: '$40/hr',
            image: '/assets/joshuaShooting.jpg',
            level: 'Advanced'
        },
        {
            id: '2',
            title: 'Fundamental Development',
            description: 'Building a strong foundation: footwork, passing, and basic scoring moves. Ideal for youth players.',
            price: '$30/hr',
            image: '/assets/joshuaLayup.jpg',
            level: 'Beginner/Intermediate'
        },
        {
            id: '3',
            title: 'Small Group Session',
            description: 'Competitive drills and live play in a small group setting. Push your limits against peers.',
            price: '$25/hr',
            image: '/assets/joshuaPassing.jpg',
            level: 'All Levels'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white pb-20">
            <Hero
                headline="TRAIN WITH PURPOSE"
                subhead="Unlock your potential with professional coaching tailored to your game."
                ctaText="Book a Session"
                ctaLink="#sessions"
                backgroundImage='/assets/joshuaShooting.jpg'
            />

            <div id="sessions" className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Available Programs</h2>
                    <p className="text-gray-400 text-lg">Choose the right path for your development.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displaySessions.map((session, index) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="bg-zinc-900 border border-white/10 h-full">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start z-10">
                                    <h4 className="font-bold text-xl mb-1">{session.title}</h4>
                                    <small className="text-default-500">{session.level}</small>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        alt={session.title}
                                        className="object-cover rounded-xl my-4 w-full h-48"
                                        src={session.image}
                                        width={"100%"}
                                    />
                                    <p className="text-gray-300 mb-4">{session.description}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-2xl font-bold text-primary">{session.price}</span>
                                    </div>
                                </CardBody>
                                <CardFooter className="pt-0">
                                    <Button className="w-full font-bold" color="primary" variant="solid">
                                        Register Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Training;
