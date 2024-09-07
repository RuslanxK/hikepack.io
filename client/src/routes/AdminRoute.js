import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../queries/userQueries';
import Spinner from '../components/loading/Spinner';
import Message from '../components/message/Message';


const AdminRoute = () => {
  const { data, loading, error } = useQuery(GET_USER);

  if (loading) return <Spinner w={4} h={4} />;
  if (error) return <Message message="Error loading user data" type="error" />;

  if (!data?.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
