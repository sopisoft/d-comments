import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import { ThemedMantineProvider } from '@/config/theme';
import { Popup } from './popup';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <ThemedMantineProvider>
      <Popup />
    </ThemedMantineProvider>
  );
}
