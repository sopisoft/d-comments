import { defaultConfigs } from '@/config/defaults';
import { SidebarConfig } from '../context/SidebarContext';

export function ResizeHandle({ config }: { config: SidebarConfig }): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const { ui_options } = defaultConfigs.comment_area_width_px;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startX.current = e.clientX;
      startWidth.current = config.width;
      const onMove = (ev: MouseEvent) => config.setWidth(startWidth.current + startX.current - ev.clientX);
      const onUp = () => {
        setIsDragging(false);
        config.saveWidth();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [config]
  );

  return (
    <div
      role="slider"
      aria-orientation="horizontal"
      aria-label="サイドバー幅の調整"
      aria-valuemin={ui_options.min}
      aria-valuemax={ui_options.max}
      aria-valuenow={config.width}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isDragging || isHover ? config.alpha(0.15) : 'transparent',
        bottom: 0,
        cursor: 'ew-resize',
        left: 0,
        position: 'absolute',
        top: 0,
        transition: 'background-color 150ms',
        width: 6,
        zIndex: 10,
      }}
    />
  );
}
