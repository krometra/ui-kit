/**
 * Реестр иконок кита: семантическое имя → компонент Lucide.
 *
 * Отдельный модуль, чтобы витрина и тесты могли перечислить имена, не
 * инстанцируя компонент. Имена задаются по роли в интерфейсе ("delete",
 * "settings"), а не по форме ("trash", "gear"): так набор можно заменить
 * целиком, не переписывая вызовы.
 *
 * Набор общего назначения. Иконки, специфичные для конкретного продукта,
 * добавляйте в приложении через проп `component` или собственный реестр.
 */
import {
  Activity, AlertTriangle, ArchiveRestore, ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  BadgeCheck, Banknote, Bell, Bookmark, Building2, Calendar, Check,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clipboard, Clock,
  Copy, CreditCard, Database, Download, ExternalLink, Eye, EyeOff, File,
  FileText, FileUp, Filter, Folder, FolderInput, FolderOpen, Globe, Heart, Home, Image, Info,
  KeyRound, LayoutDashboard, LayoutGrid, LifeBuoy, Link, List, ListChecks, Loader2, Lock,
  LogIn, LogOut, Mail, MapPin, Menu, MessageSquare, MinusCircle,
  MoreHorizontal, MoreVertical, Paperclip, Pencil, Percent, Phone, Play,
  Plus, RefreshCw, RotateCw, Save, Scissors, Search, Send, Settings, Share2, Shield,
  ShieldCheck, SlidersHorizontal, Star, Sun, Moon, Tag, Trash2, TrendingDown,
  TrendingUp, Upload, User, Users, Wallet, X, XCircle, Zap,
} from 'lucide-vue-next'

export const iconRegistry = {
  // навигация
  back: ArrowLeft,
  forward: ArrowRight,
  up: ArrowUp,
  down: ArrowDown,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  menu: Menu,
  more: MoreVertical,
  'more-horizontal': MoreHorizontal,
  home: Home,
  dashboard: LayoutDashboard,
  external: ExternalLink,
  link: Link,

  // действия
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  save: Save,
  copy: Copy,
  search: Search,
  filter: Filter,
  sliders: SlidersHorizontal,
  refresh: RefreshCw,
  rotate: RotateCw,
  scissors: Scissors,
  restore: ArchiveRestore,
  'file-up': FileUp,
  move: FolderInput,
  upload: Upload,
  download: Download,
  share: Share2,
  send: Send,
  play: Play,
  close: X,
  check: Check,
  reject: XCircle,
  remove: MinusCircle,

  // состояния и статусы
  info: Info,
  alert: AlertTriangle,
  'check-badge': BadgeCheck,
  spinner: Loader2,
  activity: Activity,
  trending: TrendingUp,
  declining: TrendingDown,
  zap: Zap,

  // объекты
  document: FileText,
  file: File,
  folder: Folder,
  'folder-open': FolderOpen,
  attach: Paperclip,
  image: Image,
  clipboard: Clipboard,
  checklist: ListChecks,
  list: List,
  grid: LayoutGrid,
  database: Database,
  tag: Tag,
  bookmark: Bookmark,
  star: Star,
  heart: Heart,

  // люди и организации
  user: User,
  users: Users,
  organization: Building2,

  // связь
  mail: Mail,
  phone: Phone,
  message: MessageSquare,
  bell: Bell,

  // безопасность
  lock: Lock,
  key: KeyRound,
  shield: Shield,
  'shield-check': ShieldCheck,
  login: LogIn,
  logout: LogOut,
  eye: Eye,
  'eye-off': EyeOff,

  // деньги
  finance: Banknote,
  wallet: Wallet,
  card: CreditCard,
  percent: Percent,

  // прочее
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  globe: Globe,
  settings: Settings,
  help: LifeBuoy,
  sun: Sun,
  moon: Moon,
}

/**
 * Расширяет реестр из приложения: registerIcons({ rescan: RotateCw }). Имена
 * действуют для всех компонентов кита, включая проп `icon` у KButton.
 */
export function registerIcons(icons) {
  Object.assign(iconRegistry, icons)
  iconNames.splice(0, iconNames.length, ...Object.keys(iconRegistry))
}

export const iconNames = Object.keys(iconRegistry)
