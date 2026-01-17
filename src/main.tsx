// Balage Diniru Sandipa
// M25W0576

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out',
});

// Add global styles for fade-in animations
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
