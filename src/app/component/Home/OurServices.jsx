import React from 'react';

const OurServices = () => {
    return (
         <section className="bg-surface-container-low py-20 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-container-max mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Our Core Services</h2>
                    <p className="text-body-md text-on-surface-variant">Specialized benefits to make your healthcare journey
                        easier</p>
                </div>
                <div className="grid md:grid-cols-3 gap-gutter">
                    
                    <div
                        className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-primary hover:-translate-y-2 transition-all">
                        <div
                            className="w-14 h-14 bg-primary text-on-primary rounded-xl flex items-center justify-center mb-6 shadow-md">
                            <span className="material-symbols-outlined text-[28px]">location_on</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md mb-3">Nearest Pharmacy</h3>
                        <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">Instantly locate pharmacies
                            closest to your current location with full address and contact details.</p>
                        <a className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline"
                            href="#">View Map <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
                    </div>
                    
                    <div
                        className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-trust-teal hover:-translate-y-2 transition-all">
                        <div
                            className="w-14 h-14 bg-trust-teal text-on-primary rounded-xl flex items-center justify-center mb-6 shadow-md">
                            <span className="material-symbols-outlined text-[28px]"
                                style="font-variation-settings: 'FILL' 1;">schedule</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md mb-3">Real-time Data</h3>
                        <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">Our inventory data is
                            updated every 15 minutes by participating local pharmacies for guaranteed accuracy.</p>
                        <a className="text-trust-teal font-label-md text-label-md flex items-center gap-1 hover:underline"
                            href="#">How it works <span
                                className="material-symbols-outlined text-sm">arrow_forward</span></a>
                    </div>
                  
                    <div
                        className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-primary-container hover:-translate-y-2 transition-all">
                        <div
                            className="w-14 h-14 bg-primary-container text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                            <span className="material-symbols-outlined text-[28px]"
                                style="font-variation-settings: 'FILL' 1;">call</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md mb-3">Direct Contact</h3>
                        <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">Call pharmacies directly
                            from the app to confirm availability or place a hold on critical prescriptions.</p>
                        <a className="text-primary-container font-label-md text-label-md flex items-center gap-1 hover:underline"
                            href="#">Contact Directory <span
                                className="material-symbols-outlined text-sm">arrow_forward</span></a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurServices;