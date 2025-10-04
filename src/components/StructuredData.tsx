'use client';

import { useEffect } from 'react';
import { generateStructuredData } from '@/lib/seo';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Article' | 'Person' | 'Event' | 'MusicGroup' | 'VideoObject';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const structuredData = generateStructuredData(type, data);
    
    // Remove existing structured data script
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}
