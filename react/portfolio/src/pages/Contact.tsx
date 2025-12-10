import React from 'react';
import { Input, Textarea, Card, CardHeader, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import {
  EnvelopeClosedIcon,
  PersonIcon,
  MobileIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: EnvelopeClosedIcon,
      label: 'Email',
      value: 'hi@joshualim.me',
      href: 'mailto:hi@joshualim.me'
    },
    {
      icon: MobileIcon,
      label: 'Phone',
      value: '+1 (937) 707-3022',
      href: 'tel:+19377073022'
    },
    {
      icon: PersonIcon,
      label: 'Location',
      value: 'Orlando, FL 32817',
      href: null
    }
  ];

  return (
    <section id="contact" className='py-20 relative'>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-TitilliumWebBold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Let's discuss your next project or just say hello!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card p-6 md:p-8">
              <CardHeader className="pb-6 pt-0 px-0">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <ChatBubbleIcon className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                  Send me a message
                </h3>
              </CardHeader>
              <CardBody className="p-0 overflow-visible">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <EnvelopeClosedIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Thanks for reaching out. I'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        isRequired
                        label="Name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "bg-light-muted/50 dark:bg-dark-muted/50 border-default-200"
                        }}
                      />
                      <Input
                        isRequired
                        label="Phone"
                        placeholder="Your phone number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "bg-light-muted/50 dark:bg-dark-muted/50 border-default-200"
                        }}
                      />
                    </div>

                    <Input
                      isRequired
                      label="Email"
                      placeholder="your.email@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "bg-light-muted/50 dark:bg-dark-muted/50 border-default-200"
                      }}
                    />

                    <Textarea
                      isRequired
                      label="Message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      variant="bordered"
                      minRows={4}
                      classNames={{
                        inputWrapper: "bg-light-muted/50 dark:bg-dark-muted/50 border-default-200"
                      }}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-light-primary dark:bg-dark-primary text-white font-bold shadow-lg"
                      size="lg"
                      isLoading={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Info Card */}
            <Card className="glass-card p-6 md:p-8">
              <CardHeader className="pb-6 pt-0 px-0">
                <h3 className="text-2xl font-bold">Contact Information</h3>
              </CardHeader>
              <CardBody className="space-y-4 p-0">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-light-muted/50 dark:bg-dark-muted/50 hover:bg-light-muted dark:hover:bg-dark-muted transition-colors">
                      <div className="w-12 h-12 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-base md:text-lg font-medium hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-base md:text-lg font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            {/* Social Links Card */}
            {/* <Card className="glass-card p-6 md:p-8">
              <CardHeader className="pb-6 pt-0 px-0">
                <h3 className="text-2xl font-bold">Follow Me</h3>
              </CardHeader>
              <CardBody className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl bg-light-muted/50 dark:bg-dark-muted/50 hover:bg-light-muted dark:hover:bg-dark-muted transition-colors group"
                      >
                        <Icon className={`w-6 h-6 transition-colors ${social.color}`} />
                        <span className="font-semibold group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors">
                          {social.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </CardBody>
            </Card> */}

            {/* Quick Info Card */}
            <div className="p-8 rounded-2xl bg-light-primary/10 dark:bg-dark-primary/10 border border-light-primary/20 dark:border-dark-primary/20 text-center">
              <h4 className="font-bold mb-2 text-xl">Quick Response</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                I typically respond to messages within 24 hours.
              </p>
              <div className="flex justify-center items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-500 font-bold uppercase tracking-wide">Available for Work</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;