import React from 'react';

const EmergencyBanner = () => {
    return (
        <section className="bg-error px-margin-mobile md:px-margin-desktop py-12 text-center text-on-error">
            <div className="max-w-container-max mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[32px]">warning</span>
                    <h2 className="text-headline-md font-headline-md">Emergency Services</h2>
                </div>
                <p className="text-body-md mb-6 text-on-error/90">For critical oxygen cylinders and urgent medicine needs
                </p>
                <button
                    className="bg-emergency-orange hover:bg-tertiary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 mx-auto transition-all shadow-lg active:scale-95">
                    <span className="material-symbols-outlined">ambulance</span>
                    Find Urgent Supplies
                </button>
            </div>
        </section>
    );
};

export default EmergencyBanner;