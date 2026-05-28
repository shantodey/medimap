import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-inverse-surface text-on-secondary-fixed-variant border-t border-outline">
            <div className="max-w-container-max mx-auto w-full py-12 px-margin-mobile md:px-margin-desktop">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    <div className="max-w-xs">
                        <span
                            className="text-headline-md font-headline-md font-bold text-primary-fixed mb-4 block">MediMap</span>
                        <p className="text-body-sm text-surface-variant">Connecting patients with essential medical supplies
                            across the nation through intelligent inventory mapping.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-3">
                            <span className="text-label-md font-label-md text-white">Services</span>
                            <a className="text-body-sm hover:text-primary-fixed hover:underline transition-all"
                                href="#">Emergency Services</a>
                            <a className="text-body-sm hover:text-primary-fixed hover:underline transition-all" href="#">About
                                Us</a>
                            <a className="text-body-sm hover:text-primary-fixed hover:underline transition-all"
                                href="#">Contact</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-label-md font-label-md text-white">Legal</span>
                            <a className="text-body-sm hover:text-primary-fixed hover:underline transition-all" href="#">Privacy
                                Policy</a>
                            <a className="text-body-sm hover:text-primary-fixed hover:underline transition-all" href="#">Terms
                                of Service</a>
                        </div>
                    </div>
                </div>
                <div
                    className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-label-sm font-label-sm">© 2024 MediMap Healthcare Solutions. All rights
                        reserved.</span>
                    <div className="flex gap-6">
                        <button
                            className="material-symbols-outlined text-surface-variant hover:text-white transition-colors">brand_awareness</button>
                        <button
                            className="material-symbols-outlined text-surface-variant hover:text-white transition-colors">hub</button>
                        <button
                            className="material-symbols-outlined text-surface-variant hover:text-white transition-colors">public</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;