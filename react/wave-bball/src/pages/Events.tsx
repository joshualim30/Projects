import { Card, CardHeader, CardBody, CardFooter, Button, Image } from '@nextui-org/react';
import Hero from '../components/Hero';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const Events = () => {
    return (
        <div className="min-h-screen text-white pb-20">
            <Hero headline="EVENTS & SCHEDULE" subhead="Join our next session." ctaText="Book Now" ctaLink="/customer-portal" />

            <div className="container mx-auto px-4 py-16 space-y-24">

                {/* Google Calendar Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Calendar className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold">Upcoming Schedule</h2>
                    </div>
                    <div className="w-full bg-white rounded-lg overflow-hidden h-[600px]">
                        <iframe
                            src="https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York"
                            style={{ border: 0 }}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            scrolling="no"
                        ></iframe>
                    </div>
                </section>

                {/* Promos / Live Events */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Ticket className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold">Live Events & Group Training</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Elite Guard Camp", date: "Dec 20 - Dec 22", price: "$150", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2690&auto=format&fit=crop" },
                            { title: "Shooting Clinic", date: "Every Saturday", price: "$40/session", img: "https://images.unsplash.com/photo-1519861531473-9200262188be?q=80&w=2672&auto=format&fit=crop" },
                            { title: "Winter League", date: "Starts Jan 5", price: "$300/team", img: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2669&auto=format&fit=crop" }
                        ].map((event, index) => (
                            <Card key={index} className="bg-zinc-900 border border-white/10">
                                <CardHeader className="p-0 z-0 overflow-hidden h-48">
                                    <Image
                                        src={event.img}
                                        alt={event.title}
                                        className="w-full h-full object-cover z-0"
                                        radius="none"
                                        isZoomed
                                    />
                                </CardHeader>
                                <CardBody className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{event.date}</p>
                                    <p className="text-primary font-bold text-lg">{event.price}</p>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" className="w-full font-bold" variant="ghost">
                                        Register Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Map Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <MapPin className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold">Training Locations</h2>
                    </div>
                    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10 filter grayscale hover:grayscale-0 transition-all duration-500">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Events;
