'use client';

import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { useStreamStore, Overlay, TextOverlay, ImageOverlay } from '@/lib/store/streamStore';
import './overlay.css';

interface OverlayItemProps {
  overlay: Overlay;
  isEditing: boolean;
}

export const OverlayItem: React.FC<OverlayItemProps> = ({ overlay, isEditing }) => {
  const { updateOverlayPosition, updateOverlaySize, selectOverlay } = useStreamStore();
  const nodeRef = useRef(null);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    updateOverlayPosition(overlay._id, data.x, data.y);
  };

  const handleResize = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    updateOverlaySize(overlay._id, data.size.width, data.size.height);
  };

  const handleSelect = () => {
    if (isEditing) {
      selectOverlay(overlay);
    }
  };

  if (!overlay.visible) {
    return null;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: overlay.position.x, y: overlay.position.y }}
      onStop={handleDragStop}
      disabled={!isEditing}
      bounds="parent"
    >
      <div ref={nodeRef} style={{ zIndex: overlay.zIndex }}>
        <Resizable
          width={overlay.size.width}
          height={overlay.size.height}
          onResize={handleResize}
          handle={
            isEditing && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 cursor-se-resize rounded-bl-sm" />
            )
          }
          resizeHandles={isEditing ? ['se'] : []}
        >
          <div 
            onClick={handleSelect}
            className={`
              absolute
              ${isEditing ? 'outline outline-1 outline-dashed outline-blue-400 hover:outline-blue-600' : ''}
              ${isEditing ? 'cursor-move' : 'pointer-events-none'}
            `}
            style={{ 
              width: `${overlay.size.width}px`,
              height: `${overlay.size.height}px`,
            }}
          >
            {overlay.type === 'text' && <TextOverlayContent overlay={overlay as TextOverlay} />}
            {overlay.type === 'image' && <ImageOverlayContent overlay={overlay as ImageOverlay} />}
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

const TextOverlayContent: React.FC<{ overlay: TextOverlay }> = ({ overlay }) => {
  return (
    <div
      style={{
        fontFamily: overlay.style.fontFamily,
        fontSize: `${overlay.style.fontSize}px`,
        fontWeight: overlay.style.fontWeight,
        color: overlay.style.color,
        backgroundColor: overlay.style.backgroundColor,
        opacity: overlay.style.opacity,
        textAlign: overlay.style.textAlign,
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: 'hidden',
      }}
    >
      {overlay.content}
    </div>
  );
};

const ImageOverlayContent: React.FC<{ overlay: ImageOverlay }> = ({ overlay }) => {
  const [imageError, setImageError] = useState(false);
  
  return imageError ? (
    <div className="w-full h-full flex items-center justify-center text-red-500 bg-gray-200 p-2 text-xs">
      Failed to load image
    </div>
  ) : (
    <img
      src={overlay.imageUrl}
      alt={overlay.alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: overlay.style.opacity,
        border: overlay.style.border,
        borderRadius: `${overlay.style.borderRadius}px`,
      }}
      onError={() => setImageError(true)}
    />
  );
};

export default function OverlayContainer() {
  const { overlay, toggleOverlayEditor } = useStreamStore();
  const { overlays, isOverlayEditorOpen } = overlay;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Overlay Items */}
      <div className="relative w-full h-full">
        {overlays.map((item) => (
          <OverlayItem
            key={item._id}
            overlay={item}
            isEditing={isOverlayEditorOpen}
          />
        ))}
      </div>
      
      {/* Edit Button */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={toggleOverlayEditor}
          className={`
            px-3 py-1.5 rounded-md transition text-sm
            ${isOverlayEditorOpen 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }
          `}
        >
          {isOverlayEditorOpen ? 'Done Editing' : 'Edit Overlays'}
        </button>
      </div>
    </div>
  );
}