import {
  Anchor,
  Mountain,
  RotateCw,
  Plane,
  Wind,
  Sun,
  BatteryCharging,
  Server,
  Cpu,
  HardHat,
  Activity,
  Cable,
  Route,
  Zap,
  Truck,
  Gauge,
  Warehouse,
  Tag,
  type LucideIcon,
} from "lucide-react"

// Maps the string icon names stored in TAG_META (lib/types.ts) to actual
// lucide-react components, so tag rendering can stay data-driven instead of
// hardcoding one JSX block per tag id.
const ICON_MAP: Record<string, LucideIcon> = {
  Anchor,
  Mountain,
  RotateCw,
  Plane,
  Wind,
  Sun,
  BatteryCharging,
  Server,
  Cpu,
  HardHat,
  Activity,
  Cable,
  Route,
  Zap,
  Truck,
  Gauge,
  Warehouse,
}

export function getTagIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Tag
}
