import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<any>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Sistema de<br/>Actas de Nacimiento</h1>
          <p className="text-lg text-blue-200/80 max-w-md leading-relaxed">
            Republica Bolivariana de Venezuela<br/>
            Consejo Nacional Electoral<br/>
            Comision de Registro Civil y Electoral
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-blue-300/70">Actas Registradas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">7</p>
              <p className="text-sm text-blue-300/70">Familiares</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">Actas Nacimiento</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenido</h2>
          <p className="text-slate-500 mb-8">Ingresa tus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div>
              <label className="label-field">Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Ingresa tu contrasena"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Iniciar Sesion
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
