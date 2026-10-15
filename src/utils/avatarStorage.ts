import { useState, useEffect } from 'react';
import defaultAdminPhoto from '../assets/admin-photo.png';

const PHOTO_STORAGE_KEY = 'bdms-admin-photo';
const PHOTO_EVENT = 'bdms-admin-photo-changed';

export function getStoredAdminPhoto(): string {
  try {
    const saved = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (saved && saved.startsWith('data:image')) {
      return saved;
    }
  } catch {}
  return defaultAdminPhoto;
}

export function setStoredAdminPhoto(dataUrl: string): void {
  try {
    localStorage.setItem(PHOTO_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new Event(PHOTO_EVENT));
  } catch {}
}

export function resetStoredAdminPhoto(): void {
  try {
    localStorage.removeItem(PHOTO_STORAGE_KEY);
    window.dispatchEvent(new Event(PHOTO_EVENT));
  } catch {}
}

export function useAdminPhoto(): {
  photo: string;
  updatePhoto: (dataUrl: string) => void;
  resetPhoto: () => void;
} {
  const [photo, setPhoto] = useState<string>(getStoredAdminPhoto);

  useEffect(() => {
    const handleUpdate = () => {
      setPhoto(getStoredAdminPhoto());
    };
    window.addEventListener(PHOTO_EVENT, handleUpdate);
    return () => window.removeEventListener(PHOTO_EVENT, handleUpdate);
  }, []);

  return {
    photo,
    updatePhoto: setStoredAdminPhoto,
    resetPhoto: resetStoredAdminPhoto,
  };
}
