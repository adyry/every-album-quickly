import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AuthCred } from '../providers';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const params = getHashParams();

const AuthCallback = () => {
  const router = useRouter();
  const { setAuth } = useContext(AuthCred);

  useEffect(() => {
    setAuth(params);
    localStorage.setItem('auth', JSON.stringify(params));
    router.push('/');
  }, [router, setAuth]);
};

export default AuthCallback;
