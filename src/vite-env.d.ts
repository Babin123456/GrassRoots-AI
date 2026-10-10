/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  export type LucideIcon = FC<LucideProps>;
  
  export const Sparkles: LucideIcon;
  export const Compass: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Library: LucideIcon;
  export const Settings: LucideIcon;
  export const Flame: LucideIcon;
  export const Radio: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const X: LucideIcon;
  export const Cpu: LucideIcon;
  export const Terminal: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const XCircle: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Info: LucideIcon;
  export const Sliders: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Upload: LucideIcon;
  export const Camera: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Sun: LucideIcon;
  export const Droplet: LucideIcon;
  export const Calendar: LucideIcon;
  export const Share2: LucideIcon;
  export const BookmarkPlus: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Clock: LucideIcon;
  export const Check: LucideIcon;
  export const MapPin: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const Square: LucideIcon;
  export const Trees: LucideIcon;
  export const Backpack: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Printer: LucideIcon;
  export const Eye: LucideIcon;
  export const Award: LucideIcon;
  export const Plus: LucideIcon;
  export const Download: LucideIcon;
  export const Trash2: LucideIcon;
  export const Search: LucideIcon;
  export const Tag: LucideIcon;
  export const Copy: LucideIcon;
  export const Layers: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Heart: LucideIcon;
  export const Github: LucideIcon;
  export const Globe: LucideIcon;
  export const Shield: LucideIcon;
  export const Leaf: LucideIcon;
  export const Sprout: LucideIcon;
  export const Bug: LucideIcon;
  export const Zap: LucideIcon;
  export const ShieldEllipsis: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Menu: LucideIcon;
}
