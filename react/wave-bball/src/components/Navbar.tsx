import { Dumbbell, Users, Calendar } from 'lucide-react';
import React from 'react';
import Logo from '../assets/logo.jpg';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react";

const SiteNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = {
        "Home": "/",
        "Training": "/training",
        "Our Story": "/our-story",
        "Contact": "/contact",
        "Customer Portal": "/customer",
    };

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            position="sticky"
            classNames={{
                base: "bg-black/80 backdrop-blur-md border-b border-white/10",
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-0",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                ],
            }}
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <a href="/" className="flex items-center gap-3">
                        <img src={Logo} alt="Wave Basketball" className="h-10 w-10 rounded-full border border-white/20" />
                        <span className="font-bold text-inherit text-xl tracking-tight text-white">WAVE BASKETBALL</span>
                    </a>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-8" justify="center">
                <NavbarItem>
                    <Link href="/training" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        Training
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Events
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/our-story" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Our Story
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        as={Link}
                        href="/customer"
                        color="primary"
                        variant="solid"
                        className="font-semibold rounded-full px-6 hidden sm:flex"
                    >
                        Customer Portal
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="bg-black/95 pt-8">
                {Object.entries(menuItems).map(([text, href], index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            className="w-full text-2xl font-semibold py-4 text-white"
                            href={href}
                            size="lg"
                        >
                            {text}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
};

export default SiteNavbar;
