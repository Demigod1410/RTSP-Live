declare module 'react-player' {
  import { ComponentType, Component } from 'react';

  export interface ReactPlayerProps {
    url?: string | string[] | null;
    playing?: boolean;
    loop?: boolean;
    controls?: boolean;
    volume?: number;
    muted?: boolean;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: object;
    progressInterval?: number;
    playsinline?: boolean;
    pip?: boolean;
    stopOnUnmount?: boolean;
    light?: boolean | string;
    fallback?: React.ReactElement;
    wrapper?: ComponentType<any>;
    playIcon?: React.ReactElement;
    previewTabIndex?: number;
    config?: {
      file?: {
        forceHLS?: boolean;
        forceVideo?: boolean;
        forceDASH?: boolean;
        hlsOptions?: object;
        dashOptions?: object;
        attributes?: object;
        tracks?: object[];
      };
      youtube?: {
        playerVars?: object;
        embedOptions?: object;
        onUnstarted?: () => void;
      };
      facebook?: {
        appId?: string;
        version?: string;
        playerId?: string;
        attributes?: object;
      };
      dailymotion?: {
        params?: object;
      };
      vimeo?: {
        playerOptions?: object;
      };
      mixcloud?: {
        options?: object;
      };
      soundcloud?: {
        options?: object;
      };
      twitch?: {
        options?: object;
        playerId?: string;
      };
      wistia?: {
        options?: object;
        playerId?: string;
      };
    };
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onEnded?: () => void;
    onError?: (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => void;
    onDuration?: (duration: number) => void;
    onSeek?: (seconds: number) => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onClickPreview?: (event: any) => void;
    onEnablePIP?: () => void;
    onDisablePIP?: () => void;
  }

  declare class ReactPlayer extends Component<ReactPlayerProps> {
    static canPlay(url: string): boolean;
    static canEnablePIP(url: string): boolean;
    static addCustomPlayer(player: ReactPlayer): void;
    static removeCustomPlayers(): void;
    seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
    getCurrentTime(): number;
    getDuration(): number;
    getInternalPlayer(key?: string): Record<string, any>;
    showPreview(): void;
  }

  export default ReactPlayer;
}