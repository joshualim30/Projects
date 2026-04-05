import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isOpenSuccess, onOpenChangeSuccess] = React.useState(false);
    const [isOpenFailure, onOpenChangeFailure] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await addDoc(collection(db, "messages"), {
                name, email, phone, message,
                timestamp: new Date()
            });
            await addDoc(collection(db, "mail"), {
                to: email,
                bcc: "joshualim@wavebasketball.net",
                template: {
                    name: "contact",
                    data: { name, email, phone: phone || "N/A", message },
                },
            });
            setIsLoading(false);
            setName(''); setEmail(''); setPhone(''); setMessage('');
            onOpenChangeSuccess(true);
        } catch (e) {
            console.error("Error adding document: ", e);
            setIsLoading(false);
            onOpenChangeFailure(true);
        }
    };

    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-6 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 sm:gap-14 lg:gap-20">

                    {/* Left: Info */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="label-tag text-[10px] sm:text-xs">Contact</span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mt-3 sm:mt-4 mb-4 sm:mb-6">
                            Let's Talk
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-10 sm:mb-12">
                            Have a question about training, or want to learn more about Wave Basketball? Fill out the form and we'll get back to you within a few days.
                        </p>

                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wave-blue" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-500 font-medium mb-1">Email</p>
                                    <a href="mailto:joshualim@wavebasketball.net" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">
                                        joshualim@wavebasketball.net
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wave-blue" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-500 font-medium mb-1">Location</p>
                                    <p className="text-xs sm:text-sm text-gray-300">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <div className="glass-card p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
                            <Input
                                placeholder="John Doe"
                                isRequired
                                type='name'
                                label='Full Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="bordered"
                                classNames={{ inputWrapper: "border-white/10 hover:border-white/20 bg-white/[0.02]" }}
                                validate={(value) => {
                                    const nameRegex = /^[a-zA-Z\s]*$/;
                                    if (!nameRegex.test(value)) return 'Please enter a valid name.';
                                }}
                            />
                            <Input
                                placeholder="example@email.com"
                                isRequired
                                type='email'
                                label='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="bordered"
                                classNames={{ inputWrapper: "border-white/10 hover:border-white/20 bg-white/[0.02]" }}
                                validate={(value) => {
                                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                    if (!emailRegex.test(value) && value.length > 0) return 'Please enter a valid email address.';
                                }}
                            />
                            <Input
                                placeholder="(123) 456-7890"
                                type='phone'
                                label='Phone Number'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                variant="bordered"
                                classNames={{ inputWrapper: "border-white/10 hover:border-white/20 bg-white/[0.02]" }}
                                validate={(value) => {
                                    const phoneRegex = /^\d{10}$/;
                                    if (!phoneRegex.test(value) && value.length > 0) return 'Please enter a valid phone number.';
                                }}
                            />
                            <Textarea
                                placeholder="Tell us about your goals, questions, or anything else..."
                                isRequired
                                label='Message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variant="bordered"
                                minRows={4}
                                classNames={{ inputWrapper: "border-white/10 hover:border-white/20 bg-white/[0.02]" }}
                                validate={(value) => {
                                    if (value.length < 10 && value.length > 0) return 'Please enter a message with at least 10 characters.';
                                }}
                            />
                            <Button
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                className="w-full bg-wave-blue text-white font-medium h-11 sm:h-12 rounded-xl hover:bg-wave-blue/90 transition-colors active:scale-[0.99]"
                                endContent={!isLoading && <Send className="w-4 h-4" />}
                            >
                                Send Message
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isOpenSuccess} onOpenChange={onOpenChangeSuccess} classNames={{ base: "bg-[#0F1629] border border-white/10" }}>
                <ModalContent>
                    <ModalHeader className="text-white">Message Sent</ModalHeader>
                    <ModalBody>
                        <p className="text-gray-400">Your message has been sent successfully! We usually respond within 3-5 business days.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-wave-blue text-white" onClick={() => window.location.href = "/"}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenFailure} onOpenChange={onOpenChangeFailure} classNames={{ base: "bg-[#0F1629] border border-white/10" }}>
                <ModalContent>
                    <ModalHeader className="text-white">Error Sending Message</ModalHeader>
                    <ModalBody>
                        <p className="text-gray-400">There was an error sending your message. Please try again later.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-wave-blue text-white" onClick={() => onOpenChangeFailure(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Contact;
