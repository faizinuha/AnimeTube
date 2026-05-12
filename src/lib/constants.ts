import type { LucideIcon } from "lucide-react";
import {
    Bot,
    Coffee,
    Compass,
    Drama,
    Ghost,
    Globe,
    Heart,
    Laugh,
    Music2,
    Rocket,
    Search,
    Shield,
    Sparkles,
    Sword,
    TrendingUp,
    Trophy,
    User,
    Wand2,
    Zap,
} from "lucide-react";

export type Genre = {
  slug: string;
  label: string;
  Icon: LucideIcon;
};

export const GENRES: Genre[] = [
  { slug: "trending",     label: "Trending",      Icon: TrendingUp },
  { slug: "action",       label: "Action",         Icon: Sword      },
  { slug: "adventure",    label: "Adventure",      Icon: Compass    },
  { slug: "comedy",       label: "Comedy",         Icon: Laugh      },
  { slug: "drama",        label: "Drama",          Icon: Drama      },
  { slug: "fantasy",      label: "Fantasy",        Icon: Wand2      },
  { slug: "sci-fi",       label: "Sci-Fi",         Icon: Rocket     },
  { slug: "mystery",      label: "Mystery",        Icon: Search     },
  { slug: "romance",      label: "Romance",        Icon: Heart      },
  { slug: "shonen",       label: "Shonen",         Icon: Zap        },
  { slug: "shojo",        label: "Shojo",          Icon: Sparkles   },
  { slug: "seinen",       label: "Seinen",         Icon: Shield     },
  { slug: "josei",        label: "Josei",          Icon: User       },
  { slug: "isekai",       label: "Isekai",         Icon: Globe      },
  { slug: "slice-of-life",label: "Slice of Life",  Icon: Coffee     },
  { slug: "sports",       label: "Sports",         Icon: Trophy     },
  { slug: "supernatural", label: "Supernatural",   Icon: Ghost      },
  { slug: "mecha",        label: "Mecha",          Icon: Bot        },
  { slug: "music",        label: "Music",          Icon: Music2     },
];

export const ANIME_QUOTES = [
  { text: "A lesson without pain is meaningless.", author: "Edward Elric — FMA: Brotherhood" },
  { text: "If you don't take risks, you can't create a future.", author: "Monkey D. Luffy — One Piece" },
  { text: "Hard work is worthless for those that don't believe in themselves.", author: "Naruto Uzumaki" },
  { text: "Power comes in response to a need, not a desire.", author: "Goku — Dragon Ball" },
  { text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", author: "Kenshin Himura" },
  { text: "I want to be the strongest. That's why I keep going.", author: "Tanjiro Kamado" },
];
