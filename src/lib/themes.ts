import { ThemeOption } from '@/types';

export const THEMES: ThemeOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Slate',
    description: 'Elegáns mély grafitszürke háttér, hűvös kék akcentusokkal (Sötét)',
    isDark: true,
    primaryColor: '#38bdf8',
    bgColor: '#090d16',
    accentColor: '#0284c7'
  },
  {
    id: 'porcelain',
    name: 'Minimal Porcelain',
    description: 'Tiszta hófehér/porcelán háttér, elegáns fekete és királykék tipográfiával (Világos)',
    isDark: false,
    primaryColor: '#0f172a',
    bgColor: '#f8fafc',
    accentColor: '#2563eb'
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    description: 'Sarkvidéki kékesszürke paletta, jégkék és fagyos türkiz árnyalatokkal (Sötét)',
    isDark: true,
    primaryColor: '#88c0d0',
    bgColor: '#242933',
    accentColor: '#81a1c1'
  },
  {
    id: 'tokyo',
    name: 'Tokyo Night',
    description: 'Mély éjszakai kék, diszkrét levendula és pasztell kék akcentusokkal (Sötét)',
    isDark: true,
    primaryColor: '#7aa2f7',
    bgColor: '#16161e',
    accentColor: '#bb9af7'
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    description: 'Bársonyos sötét tónusok, lágy meleg lila és kék pasztellekkel (Sötét)',
    isDark: true,
    primaryColor: '#cba6f7',
    bgColor: '#181825',
    accentColor: '#89b4fa'
  },
  {
    id: 'forest',
    name: 'Emerald Forest',
    description: 'Mély erdőzöld és pala árnyalatok, prémium smaragdzöld kiemeléssel (Sötét)',
    isDark: true,
    primaryColor: '#10b981',
    bgColor: '#081510',
    accentColor: '#059669'
  },
  {
    id: 'monochrome',
    name: 'Swiss Monochrome',
    description: 'Szigorú fekete-fehér és semleges szürke tipográfiai dizájn (Sötét)',
    isDark: true,
    primaryColor: '#ffffff',
    bgColor: '#000000',
    accentColor: '#e5e5e5'
  },
  {
    id: 'solarized',
    name: 'Solarized Dark',
    description: 'Klasszikus sötét cián és zöldeskék háttér, visszafogott borostyánnal (Sötét)',
    isDark: true,
    primaryColor: '#2aa198',
    bgColor: '#00212b',
    accentColor: '#268bd2'
  },
  {
    id: 'sand',
    name: 'Warm Sand & Paper',
    description: 'Meleg pergamen háttér, elegáns terrakotta és meleg barna részletekkel (Világos)',
    isDark: false,
    primaryColor: '#c2410c',
    bgColor: '#fbf8f3',
    accentColor: '#ea580c'
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    description: 'Mély indigókék fintech esztétika, modern kobaltkék fókusszal (Sötét)',
    isDark: true,
    primaryColor: '#6366f1',
    bgColor: '#0a0e1a',
    accentColor: '#4f46e5'
  }
];

export const DEFAULT_THEME_ID = 'obsidian';
