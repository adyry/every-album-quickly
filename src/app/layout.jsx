import { Providers } from './providers';

import '../../globals.css';
import '../index.css';
import '../styles.scss';

export const metadata = {
  title: 'Every Album Quickly',
  description:
    'An application meant for record digging on spotify. Based on Everynoise scraping & Spotify API. Create batches of all tracks from all releases for the given genre in the given time, next quickly browse through them to save them to the spotify playlist. Accessible & Responsive hybrid of everynoise and discoverquickly with a few additional features.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
