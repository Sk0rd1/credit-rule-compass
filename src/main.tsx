
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { uk } from 'date-fns/locale';

// Set up the application with Ukrainian locale support
// Note: We no longer need registerLocale as it's not exported by date-fns

createRoot(document.getElementById("root")!).render(<App />);
