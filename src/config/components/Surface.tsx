import { Paper, type PaperProps } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

type SurfaceTone = 'base' | 'elevated' | 'surface' | 'deep';

export type SurfaceProps = Omit<PaperProps, 'style'> & {
  tone?: SurfaceTone;
  children?: ReactNode;
  style?: CSSProperties;
};

export function Surface({ tone = 'elevated', style, ...props }: SurfaceProps): React.ReactElement {
  const { styles: ps } = useTheme();
  const background = ps.bg[tone] as string;
  const surfaceStyle: CSSProperties = {
    background,
    border: ps.panel.border,
    ...style,
  };

  return <Paper {...props} style={surfaceStyle} />;
}
