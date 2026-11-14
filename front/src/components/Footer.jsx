const Footer = ({user, setUser, authService}) => {
    return (
        <footer className="bg-[#1e293b] text-slate-400 border-t border-slate-800 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">

                {/* Column 1: Owner Attribution & Mission */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-black text-lg text-white tracking-tight">
                       <img src="favicon.png" size={20} className="w-6" alt="" />
                         Sebruna<span className="text-slate-300">Hub</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                        Engineered and maintained by <span className="text-emerald-400 font-semibold">Sebuuma Edrine</span>. Empowering agricultural supply chains through automated, direct-to-market trade architectures.
                    </p>
                </div>

                {/* Column 2: Platform Gateways */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Ecosystem Gateways</h4>
                    <div className="flex flex-col gap-1.5 text-xs">
                        <a to="/login" className="hover:text-emerald-400 transition-colors">Portal Authentication</a>
                        <a to="/register" className="hover:text-emerald-400 transition-colors">Join as Network Producer</a>
                        <a href='tel:+256759472304' className='text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-2'>+256-759-472304</a>
                    </div>
                </div>

                {/* Column 3: Live Environment Node Data */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Parameters</h4>
                    <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-slate-300">Environment: Production Node Alpha</span>
                        </div>
                        <p className="text-slate-500">Core Engine: v2.4.1 (Stable)</p>
                    </div>
                </div>
            </div>

            {/* Bottom Legal bar */}
            <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <p className="text-slate-500">
                     &copy; {new Date().getFullYear()} <span className="text-slate-400 font-semibold">Sebuuma Edrine</span>. All Rights Reserved.
                </p>
                <div className="flex gap-4 text-slate-500">
                    <span className="cursor-default hover:text-slate-400 transition-colors">Privacy Charter</span>
                    <span className="cursor-default hover:text-slate-400 transition-colors">Contract Terms</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;