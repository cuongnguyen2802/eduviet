import {
  CheckCircle,
  Star,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Clock,
  Heart,
  ThumbsUp,
  TrendingUp,
  BookOpen,
  Rocket,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

const FEATURE_ICON_MAP: Record<string, LucideIcon> = {
  CheckCircle,
  Star,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Clock,
  Heart,
  ThumbsUp,
  TrendingUp,
  BookOpen,
  Rocket,
  Sparkles,
  Target,
};

export function resolveFeatureIcon(name: string): LucideIcon {
  return FEATURE_ICON_MAP[name] ?? CheckCircle;
}
