import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-yellow-600 text-black px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img src="https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/344308804_248819884498419_3417268054519992459_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=DXCASBOuGL0Q7kNvwEIMeFk&_nc_oc=AdlO3psBNz83VN2OLUAnjOTGcLdRnRiyeiKBpXXqZBDlr8ziB1nVc3ExlzviMcbmM7U&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=j1fEJI4JgSKGA73_nFmAHQ&oh=00_AfQw-l5l-HUNN6s3nj6uZvyCiANbt8zXl1i59zRn7kbW1A&oe=687E45D2" alt="Logo" className="h-12" />
        <ul className="flex space-x-6 text-lg font-medium">
          <li><a href="#" className="hover:underline">Sobre Nosotros</a></li>
          <li><a href="#" className="hover:underline">Eventos</a></li>
          <li><a href="#" className="hover:underline">Servicios</a></li>
          <li><a href="#" className="hover:underline">Proyectos</a></li>
          <li><a href="#" className="hover:underline">Formularios</a></li>      
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
          <a href="#" className="text-lg font-semibold">Login</a>
        </button>
        </ul>
  
      </div>
    </nav>
  );
};

export default Navbar;
