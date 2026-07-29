import { LocalNotifications } from '@capacitor/local-notifications';

function nextAt8am(): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(8, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export async function checkAndNotifyBirthdays(familiares: any[]) {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const birthdayPeople = familiares.filter(f => {
    if (!f.fecha_nacimiento) return false;

    let month: number, day: number;

    // Handle YYYY-MM-DD format
    if (typeof f.fecha_nacimiento === 'string' && f.fecha_nacimiento.includes('-')) {
      const parts = f.fecha_nacimiento.split('-');
      if (parts.length === 3) {
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      } else {
        return false;
      }
    }
    // Handle DD/MM/YYYY or MM/DD/YYYY format
    else if (typeof f.fecha_nacimiento === 'string' && f.fecha_nacimiento.includes('/')) {
      const parts = f.fecha_nacimiento.split('/');
      if (parts.length === 3) {
        // Assume DD/MM/YYYY (Venezuelan format)
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
      } else {
        return false;
      }
    }
    // Handle ISO date object
    else if (f.fecha_nacimiento && typeof f.fecha_nacimiento === 'object' && 'month' in f.fecha_nacimiento) {
      month = f.fecha_nacimiento.month;
      day = f.fecha_nacimiento.day;
    }
    else {
      return false;
    }

    return month === todayMonth && day === todayDay;
  });

  if (birthdayPeople.length === 0) return;

  try {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return;

    const scheduleAt = nextAt8am();

    const notifications = birthdayPeople.map((f, index) => ({
      id: Date.now() + index,
      title: '¡Feliz Cumpleaños!',
      body: `Hoy ${f.nombre_completo} está de cumpleaños. ¡No olvides felicitarlo!`,
      schedule: { at: scheduleAt },
      smallIcon: 'ic_launcher_foreground',
      largeIcon: 'ic_launcher_foreground',
    }));

    await LocalNotifications.schedule({ notifications });
  } catch (err) {
    console.warn('Error scheduling birthday notifications:', err);
  }
}
