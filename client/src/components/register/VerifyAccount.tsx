import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Spinner from '../loading/Spinner';
import { UPDATE_VERIFIED_CREDENTIALS } from '../../mutations/userMutations';

const VerifyAccount = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();


  const [updateVerifiedCredentials] = useMutation(UPDATE_VERIFIED_CREDENTIALS);

  useEffect(() => {
    
    const verifyUser = async () => {
      try {
       
        const { data } = await updateVerifiedCredentials({ variables: { token: id } });

        if (data && data.updateVerifiedCredentials) {
          setIsVerified(true);
          navigate('/login', { replace: true });
        } else {
          setError('Verification failed. Please contact support.');
        }
      } catch (err) {
        setError('Verification failed. Please contact support.');
        console.error('Verification error:', err);
      }
    };

    verifyUser();
  }, [navigate, updateVerifiedCredentials, id]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {isVerified ? (
          <>
            <Spinner w={10} h={10} /> 
            <p className="mt-4 text-lg text-black font-semibold">Your account has been verified!</p>
            <p className="text-sm text-accent">Redirecting to login...</p>
          </>
        ) : error ? (
          <>
            <p className="mt-4 text-lg font-semibold text-red">{error}</p>
            <p className="text-sm text-accent">Please contact support for assistance.</p>
          </>
        ) : (
          <>
            <Spinner w={10} h={10} /> 
            <p className="mt-4 text-lg font-semibold text-accent">Verifying your account...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
