import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTachometerAlt, FaClipboardList } from 'react-icons/fa';
import Card from './layout/Card';

const AdminMain = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-20 p-3">
   
      <div className="sm:p-5">
        <div className="bg-white dark:bg-box p-5 rounded-lg mb-5">
          <div className="mb-4 flex items-center">
            <button
              type="button"
              className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm"
              onClick={() => navigate(-1)} 
            >
              <FaArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-semibold text-black dark:text-white">Admin Panel</h1>
          </div>
          <p className="text-left text-accent dark:text-gray-300">
            Manage and monitor your application's admin functionalities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card
            title="Dashboard"
            icon={<FaTachometerAlt size={20} />}
            onClick={() => navigate('/dashboard')}
          />
          <Card
            title="Change Log"
            icon={<FaClipboardList size={20} />}
            onClick={() => navigate('/add-changelog')}
          />
        
          <Card
            title="Users"
            icon={<FaClipboardList size={20} />}
            onClick={() => navigate('/users')}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
