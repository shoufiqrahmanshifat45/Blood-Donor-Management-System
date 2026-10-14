// Centralized unique colors and formatting for every blood group

export interface BloodGroupColorDef {
  bg: string;
  text: string;
  hex: string;
  name: string;
}

export const BLOOD_GROUP_COLORS: Record<string, BloodGroupColorDef> = {
  'A+':  { bg: 'bg-[#ef4444]', text: 'text-white', hex: '#ef4444', name: 'Crimson Red' },
  'A-':  { bg: 'bg-[#2563eb]', text: 'text-white', hex: '#2563eb', name: 'Royal Blue' },
  'B+':  { bg: 'bg-[#ea580c]', text: 'text-white', hex: '#ea580c', name: 'Vivid Orange' },
  'B-':  { bg: 'bg-[#0891b2]', text: 'text-white', hex: '#0891b2', name: 'Cyan Teal' },
  'AB+': { bg: 'bg-[#8b5cf6]', text: 'text-white', hex: '#8b5cf6', name: 'Vivid Purple' },
  'AB-': { bg: 'bg-[#db2777]', text: 'text-white', hex: '#db2777', name: 'Deep Rose' },
  'O+':  { bg: 'bg-[#b91c1c]', text: 'text-white', hex: '#b91c1c', name: 'Blood Ruby' },
  'O-':  { bg: 'bg-[#4f46e5]', text: 'text-white', hex: '#4f46e5', name: 'Electric Indigo' },
};

export const getBloodGroupColor = (group: string): BloodGroupColorDef => {
  return (
    BLOOD_GROUP_COLORS[group] || {
      bg: 'bg-[#ef4444]',
      text: 'text-white',
      hex: '#ef4444',
      name: 'Default Red',
    }
  );
};
