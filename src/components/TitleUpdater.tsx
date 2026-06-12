'use client';

import { useEffect } from 'react';

// Make sure the titles of protected routes are not revealed
export default function TitleUpdater() {
  const title = '404 | GuessEye';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
