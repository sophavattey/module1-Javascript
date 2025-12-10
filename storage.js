// Local storage key for profiles
const KEY = "user_profiles_v1";

// In-memory state for current session
const state = { 
  profiles: [], 
  currentUser: null 
};

export const getProfiles = () => {
  const stored = localStorage.getItem(KEY);
  const profiles = stored ? JSON.parse(stored) : [];
  state.profiles = [...profiles];
  return [...state.profiles];
};

const saveAll = (arr) => {
  localStorage.setItem(KEY, JSON.stringify(arr));
  state.profiles = [...arr];
};

export const addProfile = (userData) => {
  const profiles = getProfiles();
  const item = { 
    id: Date.now().toString(), 
    ...userData,
    createdAt: new Date().toISOString()
  };
  const updated = [...profiles, item];
  saveAll(updated);
  return item;
};

export const updateProfile = (id, fields = {}) => {
  const profiles = getProfiles();
  const updated = profiles.map(p => 
    p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p
  );
  saveAll(updated);
  return updated.find(p => p.id === id);
};

export const deleteProfile = (id) => {
  const profiles = getProfiles();
  const updated = profiles.filter(p => p.id !== id);
  saveAll(updated);
  return updated;
};

export const getProfileById = (id) => {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id);
};