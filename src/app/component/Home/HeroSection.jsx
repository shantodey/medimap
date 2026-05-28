import Image from "next/image";


const HeroSection = () => {
    return (
        <section className="relative min-h-125 flex items-center justify-center overflow-hidden py-16">
            <div className="absolute inset-0 z-0">
                <Image className="w-full h-full object-cover" width={100} height={100} src={"https://lh3.googleusercontent.com/aida-public/AB6AXuCMF_UnpmDAkLvVknJlr_93CJZ8CMxY-Zohd_howUNxCbvRFPUf7j-l8KqmoUkrS6oCC36vwzXwb-Jvmozw-UUMO3Ozt2RJAvRjxfz4khAqwh1kI6QA7QJ2gqR67oDdVxswbqUA8K7PX6azaG24lm2DUmx6Z9pm8jtHaVT0L2JfdE-WqDZC3-WbyFwF6oSbrHSBLCDllrmY6uXg5mpf4bIjkNAwPbpc9-DjyM2vQUD_Okkin3IX1JTx1XlEeaIZOZ2bkxnoXp098Q"}></Image> 
                    <div className="absolute inset-0 hero-gradient">
                
                    </div>
            </div>
            <div
                className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
                <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl text-white mb-4 drop-shadow-md">
                    Find Your Medicine Instantly</h1>
                <p className="text-body-lg text-white/90 mb-12 max-w-2xl mx-auto">Access real-time inventory from every
                    pharmacy in your local area in one secure location.</p>
              
                <div className="glass-effect rounded-xl p-6 max-w-3xl mx-auto shadow-xl">
                    <div className="flex flex-wrap gap-4 mb-6 justify-center">
                        <button
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-on-primary text-label-md font-label-md shadow-lg transition-transform hover:scale-105">
                            <span className="material-symbols-outlined text-[20px]">medication</span>
                            Search by Name
                        </button>
                        <button
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant text-label-md font-label-md hover:bg-secondary-container transition-colors">
                            <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                            Search by Symptoms
                        </button>
                    </div>
                    <div className="relative group">
                        <span
                            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary">search</span>
                        <input
                            className="w-full h-14 pl-12 pr-4 rounded-lg border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            placeholder="Write medicine name (e.g., Napa, Histacin, Sergel)" type="text"></input>
                    </div>
                    <button
                        className="w-full mt-4 h-12 bg-trust-teal hover:bg-success-mint text-white font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                        <span className="material-symbols-outlined">search</span>
                        Search Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;