
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerLocale } from 'date-fns';
import { uk } from 'date-fns/locale';

// Register Ukrainian locale for date-fns
registerLocale('uk', uk);

createRoot(document.getElementById("root")!).render(<App />);
