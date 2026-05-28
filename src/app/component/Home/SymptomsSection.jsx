import React from 'react';

const SymptomsSection = () => {
    return (
         <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Search by Symptoms</h2>
                <p className="text-body-md text-on-surface-variant">Identify common ailments to find appropriate
                    over-the-counter support</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
               
                <div
                    className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <div
                        className="w-16 h-16 bg-secondary-container text-trust-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[32px]">thermostat</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Fever</span>
                </div>
                <div
                    className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <div
                        className="w-16 h-16 bg-secondary-container text-trust-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[32px]">ac_unit</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Cold &amp; Cough</span>
                </div>
                <div
                    className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <div
                        className="w-16 h-16 bg-secondary-container text-trust-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[32px]">psychiatry</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Headache</span>
                </div>
                <div
                    className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <div
                        className="w-16 h-16 bg-secondary-container text-trust-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[32px]">gastroenterology</span>
                    </div>
                    <span className="text-label-md font-label-md text-on-surface">Diarrhea</span>
                </div>
            </div>
        </section>
    );
};

export default SymptomsSection;