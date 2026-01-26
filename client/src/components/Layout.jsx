import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
                {children}
            </main>
            <footer className="py-12 text-center text-muted text-sm border-t border-white/5 mt-20 bg-surface/30 backdrop-blur-xl relative z-10">
                <p className="mb-2">Cinema booking &bull; Premium Experience</p>
                <p className="opacity-50">&copy; 2026 Cinema Booking. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
