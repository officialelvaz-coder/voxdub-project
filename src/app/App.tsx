'use client';

import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
