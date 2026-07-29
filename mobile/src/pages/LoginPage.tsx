import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import {
  isBiometricAvailable,
  verifyBiometric,
  getCredentials,
  saveCredentials,
} from '../utils/biometric';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const available = await isBiometricAvailable();
        setBiometricAvailable(available);
        if (available) {
          const creds = await getCredentials();
          setHasCredentials(!!creds);
        }
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError('El correo es requerido'); return; }
    if (!emailRegex.test(email.trim())) { setError('Correo inválido'); return; }
    if (!password) { setError('La contraseña es requerida'); return; }

    setLoading(true);
    try {
      await loginWithPassword(email.trim(), password);
      if (biometricAvailable) {
        saveCredentials(email.trim(), password).catch(() => {});
      }
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.detail || err.message || 'Error al iniciar sesión';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setBiometricLoading(true);
    try {
      const creds = await getCredentials();
      if (!creds) {
        setError('No hay credenciales guardadas. Inicia sesión con tu contraseña primero.');
        setBiometricLoading(false);
        return;
      }
      const verified = await verifyBiometric();
      if (!verified) {
        setBiometricLoading(false);
        return;
      }
      await loginWithPassword(creds.username, creds.password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al autenticar');
      setBiometricLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotError('');
    setForgotMsg('');
    setNewPassword('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim()) { setForgotError('Ingresa tu correo'); return; }
    if (!emailRegex.test(forgotEmail.trim())) { setForgotError('Correo inválido'); return; }
    setForgotLoading(true);
    try {
      const r = await authAPI.forgotPassword(forgotEmail.trim());
      setNewPassword(r.data.new_password);
      setForgotMsg('Tu nueva contraseña es:');
    } catch (err: any) {
      setForgotError(err.response?.data?.detail || 'Error al procesar');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegError('');
    setRegMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim()) { setRegError('Ingresa un correo'); return; }
    if (!emailRegex.test(regEmail.trim())) { setRegError('Correo inválido'); return; }
    if (!regPassword || regPassword.length < 6) { setRegError('La contraseña debe tener al menos 6 caracteres'); return; }
    setRegLoading(true);
    try {
      const r = await authAPI.register(regEmail.trim(), regPassword);
      setRegMsg(`Usuario "${r.data.email}" creado exitosamente`);
      setRegEmail('');
      setRegPassword('');
    } catch (err: any) {
      setRegError(err.response?.data?.detail || 'Error al registrar');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Actas CNE</h1>
          <p className="text-slate-400 mt-2">Registro Civil y Electoral</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 space-y-5">
          <h2 className="text-xl font-semibold text-white text-center">Iniciar Sesión</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          {biometricAvailable && hasCredentials && (
            <>
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={biometricLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-medium rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                {biometricLoading ? 'Verificando...' : 'Iniciar con huella / Face ID'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500 text-center">o usa tu contraseña</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>
            </>
          )}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 text-center">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition text-center"
                placeholder="correo@ejemplo.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 text-center">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition text-center"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition cursor-pointer"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setShowForgotModal(true); setForgotEmail(email); setForgotError(''); setForgotMsg(''); setNewPassword(''); }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <p className="text-center text-sm text-slate-400">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => { setShowRegisterModal(true); setRegError(''); setRegMsg(''); }}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Recuperar contraseña</h3>
            {forgotMsg && !newPassword && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-lg p-3 text-center">
                {forgotMsg}
              </div>
            )}
            {forgotError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center">
                {forgotError}
              </div>
            )}
            {newPassword ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-300 text-center">Tu nueva contraseña es:</p>
                <div className="bg-slate-900/80 border border-slate-600/50 rounded-lg p-3 text-center">
                  <span className="text-emerald-400 font-mono text-lg tracking-wider">{newPassword}</span>
                </div>
                <p className="text-xs text-slate-500 text-center">Cópiala y guárdala en un lugar seguro.</p>
                <button
                  onClick={() => { setShowForgotModal(false); setNewPassword(''); setForgotMsg(''); setForgotEmail(''); }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Ingresa tu correo y te generaremos una nueva contraseña.</p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="correo@ejemplo.com"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowForgotModal(false); setForgotEmail(''); }}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                  >
                    {forgotLoading ? 'Generando...' : 'Generar nueva contraseña'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Registrarse</h3>
            {regMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-lg p-3 text-center">
                {regMsg}
              </div>
            )}
            {regError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center">
                {regError}
              </div>
            )}
            {!regMsg && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Crea una cuenta para usar el sistema.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => { setRegEmail(e.target.value); setRegError(''); }}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegError(''); }}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="mínimo 6 caracteres"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowRegisterModal(false); setRegMsg(''); setRegError(''); }}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRegister}
                    disabled={regLoading}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                  >
                    {regLoading ? 'Creando...' : 'Crear cuenta'}
                  </button>
                </div>
              </div>
            )}
            {regMsg && (
              <button
                onClick={() => { setShowRegisterModal(false); setRegMsg(''); }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition cursor-pointer"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
