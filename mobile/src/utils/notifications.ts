import { LocalNotifications } from '@capacitor/local-notifications';

export async function checkAndNotifyBirthdays(familiares: any[]) {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const birthdayPeople = familiares.filter(f => {
    if (!f.fecha_nacimiento) return false;
    const parts = f.fecha_nacimiento.split('-');
    if (parts.length !== 3) return false;
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return month === todayMonth && day === todayDay;
  });

  if (birthdayPeople.length === 0) return;

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return;

  const notifications = birthdayPeople.map((f, index) => ({
    id: Date.now() + index,
    title: '¡Feliz Cumpleaños! 🎂',
    body: `Hoy es el cumpleaños de ${f.nombre_completo}. ¡No olvides felicitarlo!`,
    schedule: { at: new Date(Date.now() + 1000) },
    smallIcon: 'ic_launcher_foreground',
    largeIcon: 'ic_launcher_foreground',
  }));

  await LocalNotifications.schedule({ notifications });
}
