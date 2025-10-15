import { create } from 'zustand';

// Define a base type for all overlays
export interface BaseOverlay {
  _id: string;
  name: string;
  type: 'text' | 'image';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  visible: boolean;
}

// Type for text overlay
export interface TextOverlay extends BaseOverlay {
  type: 'text';
  content: string;
  style: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    opacity: number;
    textAlign: 'left' | 'center' | 'right';
  };
}

// Type for image overlay
export interface ImageOverlay extends BaseOverlay {
  type: 'image';
  imageUrl: string;
  alt: string;
  style: {
    opacity: number;
    border: string;
    borderRadius: number;
  };
}

// Union type for all overlay types
export type Overlay = TextOverlay | ImageOverlay;

export interface StreamState {
  rtspUrl: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullScreen: boolean;
  isCustomRtspUrl: boolean;
  customRtspUrl: string;
}

export interface OverlayState {
  overlays: Overlay[];
  selectedOverlay: Overlay | null;
  isOverlayEditorOpen: boolean;
}

interface StreamStore {
  stream: StreamState;
  overlay: OverlayState;
  
  // Stream actions
  setRtspUrl: (url: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullScreen: () => void;
  setCustomRtspUrl: (url: string) => void;
  applyCustomUrl: () => void;
  
  // Overlay actions
  setOverlays: (overlays: Overlay[]) => void;
  addOverlay: (overlay: Overlay) => void;
  updateOverlay: (id: string, updates: Partial<Overlay>) => void;
  removeOverlay: (id: string) => void;
  selectOverlay: (overlay: Overlay | null) => void;
  toggleOverlayEditor: () => void;
  updateOverlayPosition: (id: string, x: number, y: number) => void;
  updateOverlaySize: (id: string, width: number, height: number) => void;
}

// Helper function to safely update overlays with type checking
const updateOverlayArray = (
  overlays: Overlay[],
  id: string,
  updater: (overlay: Overlay) => Overlay
): Overlay[] => {
  return overlays.map(overlay => 
    overlay._id === id ? updater(overlay) : overlay
  );
};

export const useStreamStore = create<StreamStore>((set) => ({
  // Initial stream state
  stream: {
    rtspUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    isFullScreen: false,
    isCustomRtspUrl: false,
    customRtspUrl: '',
  },
  
  // Initial overlay state
  overlay: {
    overlays: [],
    selectedOverlay: null,
    isOverlayEditorOpen: false,
  },
  
  // Stream actions
  setRtspUrl: (url) => set(state => ({ 
    stream: { ...state.stream, rtspUrl: url } 
  })),
  
  setIsPlaying: (isPlaying) => set(state => ({ 
    stream: { ...state.stream, isPlaying } 
  })),
  
  setVolume: (volume) => set(state => ({ 
    stream: { ...state.stream, volume, isMuted: volume === 0 } 
  })),
  
  toggleMute: () => set(state => ({ 
    stream: { ...state.stream, isMuted: !state.stream.isMuted } 
  })),
  
  toggleFullScreen: () => set(state => ({ 
    stream: { ...state.stream, isFullScreen: !state.stream.isFullScreen } 
  })),
  
  setCustomRtspUrl: (url) => set(state => ({ 
    stream: { ...state.stream, customRtspUrl: url } 
  })),
  
  applyCustomUrl: () => set(state => {
    if (!state.stream.customRtspUrl) return state;
    return { 
      stream: { 
        ...state.stream, 
        rtspUrl: state.stream.customRtspUrl,
        isCustomRtspUrl: true
      } 
    };
  }),
  
  // Overlay actions
  setOverlays: (overlays) => set(state => ({ 
    overlay: { ...state.overlay, overlays } 
  })),
  
  addOverlay: (overlay) => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      overlays: [...state.overlay.overlays, overlay] 
    } 
  })),
  
  updateOverlay: (id, updates) => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      overlays: updateOverlayArray(
        state.overlay.overlays,
        id,
        overlay => ({ ...overlay, ...updates } as Overlay)
      )
    } 
  })),
  
  removeOverlay: (id) => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      overlays: state.overlay.overlays.filter(overlay => overlay._id !== id)
    } 
  })),
  
  selectOverlay: (overlay) => set(state => ({ 
    overlay: { ...state.overlay, selectedOverlay: overlay } 
  })),
  
  toggleOverlayEditor: () => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      isOverlayEditorOpen: !state.overlay.isOverlayEditorOpen 
    } 
  })),
  
  updateOverlayPosition: (id, x, y) => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      overlays: updateOverlayArray(
        state.overlay.overlays,
        id,
        overlay => ({ ...overlay, position: { x, y } })
      )
    } 
  })),
  
  updateOverlaySize: (id, width, height) => set(state => ({ 
    overlay: { 
      ...state.overlay, 
      overlays: updateOverlayArray(
        state.overlay.overlays,
        id,
        overlay => ({ ...overlay, size: { width, height } })
      )
    } 
  })),
}));