import { NativeBiometric } from '@capgo/capacitor-native-biometric';

interface BiometricCredentials {
  username: string;
  password: string;
}

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

export async function verifyBiometric(): Promise<boolean> {
  try {
    await NativeBiometric.verifyIdentity({
      reason: 'Iniciar sesión en Actas CNE',
      title: 'Autenticación biométrica',
      subtitle: 'Usa tu huella o Face ID',
      description: 'Coloca tu dedo en el sensor',
    });
    return true;
  } catch {
    return false;
  }
}

export async function saveCredentials(username: string, password: string): Promise<void> {
  try {
    await NativeBiometric.setCredentials({
      username,
      password,
      server: 'actas-cne',
    });
  } catch {}
}

export async function getCredentials(): Promise<BiometricCredentials | null> {
  try {
    const result = await NativeBiometric.getCredentials({
      server: 'actas-cne',
    });
    return { username: result.username, password: result.password };
  } catch {
    return null;
  }
}

export async function deleteCredentials(): Promise<void> {
  try {
    await NativeBiometric.deleteCredentials({
      server: 'actas-cne',
    });
  } catch {}
}
