import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../features/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  return <ForgotPasswordForm onBack={() => navigate('/login')} />;
}
