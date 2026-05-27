"use client"
import { useState } from "react";
import { Link } from "@heroui/react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import Image from "next/image";
import logo from '@/assets/logo.png'

const Navber = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
            <div className="container mx-auto">

                <header className="flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            <span className="sr-only">Menu</span>
                            {isMenuOpen ? (
                                <HiOutlineMenuAlt1 />
                            ) : (
                                <HiOutlineMenuAlt1 />
                            )}
                        </button>
                        <div>
                            <Image src={logo} alt="logo"/>
                        </div>
                    </div>
                    <ul className="hidden items-center gap-4 md:flex">
                        <li>
                            <Link href="#">Features</Link>
                        </li>
                        <li>
                            <Link href="#">Pricing</Link>
                        </li>
                    </ul>
                </header>
                {
                    isMenuOpen && (
                        <div className="border-t border-separator md:hidden">
                            <ul className="flex flex-col gap-2 p-4">
                                <li>
                                    <Link href="#" className="block py-2">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="block py-2">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div >
        </nav >
    );
};

export default Navber;


