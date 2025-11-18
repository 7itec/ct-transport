import {useState, useRef} from 'react';
import {Keyboard, TextInput} from 'react-native';

import useLogs from 'hooks/use-logs';
import login from 'modules/authentication/hooks/login';

const useLoginState = () => {
  const {mutate, isLoading} = login();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const passwordInputRef = useRef<TextInput>(null);
  const {trackEvent} = useLogs();

  const closeKeyboardAndLogin = () => {
    Keyboard.dismiss();
    handleLogin();
  };

  const handleLogin = async () => {
    trackEvent('Login', {username, password});
    mutate({username, password});
  };

  return {
    username,
    setUsername,
    setPassword,
    handleLogin,
    isLoading,
    passwordInputRef,
    closeKeyboardAndLogin,
  };
};

export default useLoginState;
