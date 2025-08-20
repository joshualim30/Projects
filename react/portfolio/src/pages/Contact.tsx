// Contact.tsx - Contact page component
// 10/22/2024 - Joshua Lim

import React from 'react';
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";

// Contact page component
const Contact = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isOpenSuccess, onOpenChangeSuccess] = React.useState(false);
  const [isOpenFailure, onOpenChangeFailure] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <section id="contact" className='min-h-screen w-full flex flex-col px-6 py-12 bg-gradient-to-br from-background to-default-50'>
      <div className='flex-1 w-full max-w-2xl mx-auto flex items-center justify-center'>
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-default-200">
            <div className="text-center mb-8">
              <h1 className='font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Let's get in touch!
              </h1>
              <h2 className='font-normal text-lg md:text-xl text-default-500'>
                Feel free to shoot me a message and I will get back to you as soon as possible!
              </h2>
            </div>
            
            <div className="space-y-6">
              <Input
                isRequired
                label="Name"
                placeholder="John Doe"
                type='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                classNames={{
                  input: "text-lg",
                  label: "text-base font-medium"
                }}
                size="lg"
              />
              <Input
                isRequired
                label="Email"
                placeholder="example@email.com"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  input: "text-lg",
                  label: "text-base font-medium"
                }}
                size="lg"
              />
              <Input
                label="Phone Number"
                placeholder="123-456-7890"
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                classNames={{
                  input: "text-lg",
                  label: "text-base font-medium"
                }}
                size="lg"
              />
              <Textarea
                isRequired
                label="Message"
                placeholder="Hello! I would like to get in touch with you!"
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                classNames={{
                  input: "text-lg",
                  label: "text-base font-medium"
                }}
                size="lg"
                minRows={4}
              />
              <Button 
                color="primary" 
                variant="shadow"
                className='w-full font-semibold shadow-xl hover:shadow-2xl transition-shadow' 
                size="lg"
                onClick={
                  async () => {
                    // Enable loading state
                    setIsLoading(true);

                    // Add message to Firestore
                    try {
                      // Add a new document with a generated id
                      await addDoc(collection(db, "messages"), {
                        name: name,
                        email: email,
                        phone: phone,
                        message: message,
                        timestamp: new Date()
                      });

                      // Disable loading state
                      setIsLoading(false);

                      // Clear form
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');

                      // Open modal
                      onOpenChangeSuccess(true);
                    } catch (e) {
                      console.error("Error adding document: ", e);
                      // Disable loading state
                      setIsLoading(false);

                      // Open modal
                      onOpenChangeFailure(true);
                    }
                  }
                } 
                isLoading={isLoading}
              >
                Send Message
              </Button>
            </div>
          </div>
          
          <Modal isOpen={isOpenSuccess} onOpenChange={onOpenChangeSuccess}>
            <ModalContent className="bg-background/95 backdrop-blur-sm">
              <ModalHeader className="text-2xl font-bold">Message Sent</ModalHeader>
              <ModalBody>
                <p className="text-lg">Your message has been sent successfully! I will get back to you as soon as possible!</p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="primary" 
                  variant="shadow"
                  onClick={() => onOpenChangeSuccess(false)}
                  className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          <Modal isOpen={isOpenFailure} onOpenChange={onOpenChangeFailure}>
            <ModalContent className="bg-background/95 backdrop-blur-sm">
              <ModalHeader className="text-2xl font-bold">Error Sending Message</ModalHeader>
              <ModalBody>
                <p className="text-lg">There was an error sending your message :( Please try again later!</p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="primary" 
                  variant="shadow"
                  onClick={() => onOpenChangeFailure(false)}
                  className="font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;