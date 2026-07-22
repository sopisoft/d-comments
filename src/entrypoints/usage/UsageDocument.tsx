import { Typography } from '@mantine/core';
import type { RefObject } from 'react';
import MD_HTML from './usage.md?html';

export function UsageDocument({ contentRef }: { contentRef: RefObject<HTMLDivElement | null> }): React.ReactElement {
  return (
    <Typography ref={contentRef}>
      <div dangerouslySetInnerHTML={{ __html: MD_HTML }} />
    </Typography>
  );
}
