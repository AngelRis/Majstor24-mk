import { useState } from 'react';
import { registerUser } from '../services/authApi';
import type { RegisterUserDto } from '../types/auth';
import { roles } from '../constants/roles';
import styles from './css/Register.module.css'
import { useNavigate } from 'react-router-dom';



export default function Register() {
  const [formData, setFormData] = useState<RegisterUserDto>({
    username: '', email: '', password: '', confirmedPassword: '',
    fullName: '', phone: '', role: ''
  });
    const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/login');
    } catch(error:any) {
      setErrorMessage(error.message);
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Регистрација</h2>

      <div className={styles.grid}>
        <input name="username" className={styles.input} required value={formData.username} onChange={handleChange} placeholder="Kорисничко име" />
        <input name="email" className={styles.input} required value={formData.email} onChange={handleChange} placeholder="Е-пошта" />

        <input name="password" className={styles.input} required type="password" value={formData.password} onChange={handleChange} placeholder="Лозинка" />
        <input name="confirmedPassword" className={styles.input} required type="password" value={formData.confirmedPassword} onChange={handleChange} placeholder="Потврди лозинка" />

        <input name="fullName" className={styles.input} required value={formData.fullName} onChange={handleChange} placeholder="Целосно име" />
        <input name="phone" className={styles.input} required value={formData.phone} onChange={handleChange} placeholder="Телефон" />

        <select name="role" required className={styles.input} value={formData.role} onChange={handleChange}>
          <option value="">-Избери улога-</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.button}>Регистрирај се</button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>

  );
}