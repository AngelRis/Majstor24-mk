import { useState } from 'react';
import { loginUser } from '../services/authApi';
import styles from './css/Login.module.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await loginUser({ username, password });
      login(token);
      navigate('/');
    }  catch (error) {
      setErrorMessage('Неуспешна најава.');

    }
  };

  return (
   <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Најавa</h2>
      <input
        className={styles.input}
        value={username}
        required
        onChange={e => setUsername(e.target.value)}
        placeholder="Kорисничко име"
      />
      <input
        className={styles.input}
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Лозинка"
      />
      <button className={styles.button} type="submit">Најави се</button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
}
