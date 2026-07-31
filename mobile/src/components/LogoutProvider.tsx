import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

interface LogoutContextType {
  requestLogout: () => void;
}

const LogoutContext = createContext<LogoutContextType | null>(null);

export function LogoutProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const requestLogout = () => setOpen(true);

  return (
    <LogoutContext.Provider value={{ requestLogout }}>
      {children}
      <ConfirmModal
        open={open}
        title="Cerrar sesión"
        message="¿Estás seguro de cerrar sesión?"
        confirmLabel="Sí, cerrar sesión"
        cancelLabel="Cancelar"
        variant="success"
        onConfirm={() => { setOpen(false); logout(); }}
        onCancel={() => setOpen(false)}
      />
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const ctx = useContext(LogoutContext);
  if (!ctx) throw new Error('useLogout must be inside LogoutProvider');
  return ctx;
}
