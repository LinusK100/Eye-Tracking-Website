import type { CategoryConfig } from '../types';
import { assetUrl } from '../utils/assetUrl';

export const CATEGORIES: CategoryConfig[] = [
  {
    type: 'no_distraction',
    label: 'Nur Aufgaben',
    hasVideo: false,
    hasSound: false,
    videoSrc: '',
  },
  {
    type: 'tiktok_no_sound',
    label: 'TikTok – ohne Ton',
    hasVideo: true,
    hasSound: false,
    videoSrc: assetUrl('/videos/tiktok-1.mp4'),
    videoSrcs: [assetUrl('/videos/tiktok-1.mp4'), assetUrl('/videos/tiktok-2.mp4'), assetUrl('/videos/tiktok-3.mp4')],
  },
  {
    type: 'tiktok_with_sound',
    label: 'TikTok – mit Ton',
    hasVideo: true,
    hasSound: true,
    videoSrc: assetUrl('/videos/tiktok-1.mp4'),
    videoSrcs: [assetUrl('/videos/tiktok-1.mp4'), assetUrl('/videos/tiktok-2.mp4'), assetUrl('/videos/tiktok-3.mp4')],
  },
  {
    type: 'movie_no_sound',
    label: 'Film – ohne Ton',
    hasVideo: true,
    hasSound: false,
    videoSrc: assetUrl('/videos/movie-1.mp4'),
    videoSrcs: [assetUrl('/videos/movie-1.mp4'), assetUrl('/videos/movie-2.mp4'), assetUrl('/videos/movie-3.mp4')],
  },
  {
    type: 'movie_with_sound',
    label: 'Film – mit Ton',
    hasVideo: true,
    hasSound: true,
    videoSrc: assetUrl('/videos/movie-1.mp4'),
    videoSrcs: [assetUrl('/videos/movie-1.mp4'), assetUrl('/videos/movie-2.mp4'), assetUrl('/videos/movie-3.mp4')],
  },
  {
    type: 'iphone',
    label: 'iPhone',
    hasVideo: false,
    hasSound: true,
    videoSrc: '',
    notificationTypes: {
      easy:   'lock_screen',
      medium: 'chat',
      hard:   'call',
    },
  },
];
