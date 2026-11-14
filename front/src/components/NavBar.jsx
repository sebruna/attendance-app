
const NavBar = ({user, setUser, authService}) => {
    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
            <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-emerald-800 px-2 py-1 rounded mr-2">{user.role}</span>
                <span className="font-semibold text-gray-700">Hallo, {user.name}</span>
            </div>
            <button onClick={() => { authService.logout(); setUser(null); }} className="text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer transition">
              Logout →
            </button>
        </nav>
    );
};

export default NavBar;