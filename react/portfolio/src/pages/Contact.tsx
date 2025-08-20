// Contact.tsx - Contact page component (Mobile-First Redesign)
// 10/22/2024 - Joshua Lim

import React from 'react';
import { Input, Textarea, Card, CardHeader, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { 
  EnvelopeClosedIcon, 
  PersonIcon, 
  MobileIcon, 
  ChatBubbleIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon
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

  const socialLinks = [
    {
      icon: GitHubLogoIcon,
      label: 'GitHub',
      href: 'https://github.com/joshualim30',
      color: 'text-default-600 hover:text-foreground'
    },
    {
      icon: LinkedInLogoIcon,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/joshualim30',
      color: 'text-blue-500 hover:text-blue-600'
    },
    {
      icon: TwitterLogoIcon,
      label: 'Twitter',
      href: 'https://twitter.com/joshualim30',
      color: 'text-blue-400 hover:text-blue-500'
    }
  ];

  return (
    <section id="contact" className='min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 mb-6">
            Let's discuss your next project or just say hello!
          </p>
        </motion.div>

        {/* Two-Column Layout - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <ChatBubbleIcon className="w-6 h-6 text-primary" />
                  Send me a message
                </h2>
              </CardHeader>
              <CardBody>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <EnvelopeClosedIcon className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400">Thanks for reaching out. I'll get back to you soon!</p>
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
                        size="lg"
                        startContent={<PersonIcon className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          inputWrapper: "shadow-sm border-gray-300 dark:border-gray-600"
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
                        size="lg"
                        startContent={<MobileIcon className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          inputWrapper: "shadow-sm border-gray-300 dark:border-gray-600"
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
                      size="lg"
                      startContent={<EnvelopeClosedIcon className="w-4 h-4 text-gray-400" />}
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300 dark:border-gray-600"
                      }}
                    />

                    <Textarea
                      isRequired
                      label="Message"
                      placeholder="Tell me about your project or just say hello..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      variant="bordered"
                      minRows={4}
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300 dark:border-gray-600"
                      }}
                    />

                    <Button
                      type="submit"
                      color="primary"
                      variant="shadow"
                      size="lg"
                      isLoading={isLoading}
                      className="w-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                      startContent={!isLoading && <EnvelopeClosedIcon className="w-5 h-5" />}
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Info Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-default-50/50 hover:bg-default-100/50 transition-colors">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-default-500 uppercase tracking-wide">{info.label}</p>
                        {info.href ? (
                          <a 
                            href={info.href} 
                            className="text-sm md:text-base text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm md:text-base text-foreground font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            {/* Social Links Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Follow Me</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-lg bg-default-50/50 hover:bg-default-100/50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-default-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className={`w-5 h-5 ${social.color} transition-colors`} />
                        </div>
                        <span className="text-sm md:text-base text-foreground group-hover:text-primary transition-colors font-medium">
                          {social.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Quick Info Card */}
            <Card className="bg-primary/5 backdrop-blur-md shadow-xl border border-primary/20">
              <CardBody className="text-center p-6">
                <h4 className="text-lg font-bold text-foreground mb-2">Quick Response</h4>
                <p className="text-sm text-default-600 mb-4">
                  I typically respond to messages within 24 hours. For urgent matters, feel free to call!
                </p>
                <div className="flex justify-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  <span className="text-xs text-success font-medium">Available for new projects</span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;