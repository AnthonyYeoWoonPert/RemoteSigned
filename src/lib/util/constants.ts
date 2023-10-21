// I know you may be wondering, why tf is the key to encrypt/decrypt
// stored as plaintext and tracked by git. The answer is, I'm poor
// and can't afford a backend server running 24/7 to handle stuff
// properly.
//
// But even then this should be somewhat safe, as the user still
// needs to enter a PIN number which adds some ✨spice✨.
//
// A competent reverse engineer would still be able to crack it,
// given he knows the key. Future maintainers, do something about
// this, or not, I don't think anyone would care to crack this anyways
export const KEY =
  'Ev7&IIBUcmYu6k%KtOz%4Nfz!hmRE94E^457^Z3#VARrqY^SnlCJr50nN4RXhKu1vXD8vFuek0h^vUeP@YAdtpb4lM3tTW6cuLBm%BD7L6*wGVMT5tfy0^FkPUNpek&p';

export const LOCAL_STORAGE_ACCOUNT_KEY = 'accounts';
export const LOCAL_STORAGE_SETTINGS_KEY = 'settings';
