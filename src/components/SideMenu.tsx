import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <nav className="w-64 bg-gray-800 min-h-screen p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/governance" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            Governance
          </Link>
        </li>
        <li>
          <Link to="/missions" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            Missions
          </Link>
        </li>
        <li>
          <Link to="/team" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            My Team
          </Link>
        </li>
        <li>
          <Link to="/os" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            OS
          </Link>
        </li>
        <li>
          <Link to="/training" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            Training
          </Link>
        </li>
        <li>
          <Link to="/gpus" className="text-gray-300 hover:text-white block py-2 px-4 rounded hover:bg-gray-700">
            GPUs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideMenu;
