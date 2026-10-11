import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CheckSquare, LockKeyhole } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = ({ initialMode = 'login' }) => {
  const { user, setupStatus, loading, signIn, createAccount } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = initialMode === 'register';

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isRegister) {
        await createAccount(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <p>Loading...</p>
      </main>
    );
  }

  const title = isRegister ? 'Create your account' : 'Sign in to Smart To-Do';

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link to="/" className="auth-brand">
          <CheckSquare size={22} />
          <span>Smart To-Do</span>
        </Link>
        <div className="auth-heading">
          <span className="auth-icon"><LockKeyhole size={19} /></span>
          <h1 id="auth-title">{title}</h1>
          <p>
            {isRegister
              ? 'Get started with your private task workspace.'
              : 'Sign in to access your personal tasks.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-field">
              <span>Name</span>
              <input
                autoComplete="name"
                maxLength={80}
                name="name"
                onChange={handleChange}
                required
                placeholder="Your Name"
                value={form.name}
              />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              maxLength={254}
              name="email"
              onChange={handleChange}
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              maxLength={72}
              minLength={6}
              name="password"
              onChange={handleChange}
              required
              type="password"
              placeholder="••••••••"
              value={form.password}
            />
            {isRegister && <small>Use at least 6 characters.</small>}
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="btn-primary auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to Smart To-Do?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AuthPage;