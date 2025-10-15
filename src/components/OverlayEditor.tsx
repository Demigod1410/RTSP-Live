'use client';

import { useState } from 'react';
import { useStreamStore, Overlay, TextOverlay, ImageOverlay } from '@/lib/store/streamStore';
import { HexColorPicker } from 'react-colorful';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function OverlayEditor() {
  const { overlay, updateOverlay, removeOverlay } = useStreamStore();
  const { selectedOverlay } = overlay;
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'text' | 'background'>('text');
  
  if (!selectedOverlay) {
    return (
      <div className="p-4 border rounded-md bg-gray-800 border-gray-700 text-white">
        <h3 className="text-lg font-semibold mb-4">Overlay Settings</h3>
        <p>Select an overlay to edit its properties</p>
      </div>
    );
  }
  
  // Generic update method
  const handleUpdate = <K extends keyof Overlay>(key: K, value: Overlay[K]) => {
    updateOverlay(selectedOverlay._id, { [key]: value } as Partial<Overlay>);
  };
  
  // Type-specific update methods
  const handleTextUpdate = (key: keyof TextOverlay, value: any) => {
    if (selectedOverlay.type !== 'text') return;
    updateOverlay(selectedOverlay._id, { [key]: value } as Partial<Overlay>);
  };
  
  const handleImageUpdate = (key: keyof ImageOverlay, value: any) => {
    if (selectedOverlay.type !== 'image') return;
    updateOverlay(selectedOverlay._id, { [key]: value } as Partial<Overlay>);
  };
  
  // Type-safe style update functions based on overlay type
  const handleTextStyleUpdate = (
    key: keyof TextOverlay['style'], 
    value: any
  ) => {
    if (selectedOverlay.type !== 'text') return;
    updateOverlay(selectedOverlay._id, {
      style: {
        ...(selectedOverlay as TextOverlay).style,
        [key]: value
      }
    } as Partial<Overlay>);
  };
  
  const handleImageStyleUpdate = (
    key: keyof ImageOverlay['style'], 
    value: any
  ) => {
    if (selectedOverlay.type !== 'image') return;
    updateOverlay(selectedOverlay._id, {
      style: {
        ...(selectedOverlay as ImageOverlay).style,
        [key]: value
      }
    } as Partial<Overlay>);
  };
  
  const handleStyleUpdate = (key: string, value: any) => {
    if (selectedOverlay.type === 'text') {
      handleTextStyleUpdate(key as keyof TextOverlay['style'], value);
    } else if (selectedOverlay.type === 'image') {
      handleImageStyleUpdate(key as keyof ImageOverlay['style'], value);
    }
  };
  
  const handleOpenColorPicker = (type: 'text' | 'background') => {
    setColorPickerType(type);
    setShowColorPicker(true);
  };
  
  const handleColorChange = (color: string) => {
    if (selectedOverlay.type === 'text') {
      handleStyleUpdate(
        colorPickerType === 'text' ? 'color' : 'backgroundColor', 
        color
      );
    }
  };
  
  const renderTextOverlayControls = () => {
    if (selectedOverlay.type !== 'text') return null;
    const textOverlay = selectedOverlay as TextOverlay;
    
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={textOverlay.content}
            onChange={(e) => handleTextUpdate('content', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Font Family</label>
            <select
              value={textOverlay.style.fontFamily}
              onChange={(e) => handleStyleUpdate('fontFamily', e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Font Size (px)</label>
            <input
              type="number"
              value={textOverlay.style.fontSize}
              onChange={(e) => handleStyleUpdate('fontSize', Number(e.target.value))}
              min={8}
              max={120}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Font Weight</label>
            <select
              value={textOverlay.style.fontWeight}
              onChange={(e) => handleStyleUpdate('fontWeight', e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">100 (Thin)</option>
              <option value="300">300 (Light)</option>
              <option value="500">500 (Medium)</option>
              <option value="700">700 (Bold)</option>
              <option value="900">900 (Black)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Text Align</label>
            <select
              value={textOverlay.style.textAlign}
              onChange={(e) => handleStyleUpdate('textAlign', e.target.value as 'left' | 'center' | 'right')}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <div
              className="w-full h-8 rounded-md cursor-pointer flex items-center justify-center text-sm"
              style={{ backgroundColor: textOverlay.style.color }}
              onClick={() => handleOpenColorPicker('text')}
            >
              {textOverlay.style.color}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Background</label>
            <div
              className="w-full h-8 rounded-md cursor-pointer flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: textOverlay.style.backgroundColor,
                color: textOverlay.style.backgroundColor === 'transparent' 
                  ? 'white' 
                  : getContrastColor(textOverlay.style.backgroundColor)
              }}
              onClick={() => handleOpenColorPicker('background')}
            >
              {textOverlay.style.backgroundColor || 'transparent'}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderImageOverlayControls = () => {
    if (selectedOverlay.type !== 'image') return null;
    const imageOverlay = selectedOverlay as ImageOverlay;
    
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={imageOverlay.imageUrl}
            onChange={(e) => handleImageUpdate('imageUrl', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="https://example.com/image.png"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Alt Text</label>
          <input
            type="text"
            value={imageOverlay.alt}
            onChange={(e) => handleImageUpdate('alt', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            placeholder="Description of the image"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Border</label>
            <input
              type="text"
              value={imageOverlay.style.border}
              onChange={(e) => handleStyleUpdate('border', e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="1px solid white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Border Radius (px)</label>
            <input
              type="number"
              value={imageOverlay.style.borderRadius}
              onChange={(e) => handleStyleUpdate('borderRadius', Number(e.target.value))}
              min={0}
              max={50}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="p-4 border rounded-md bg-gray-800 border-gray-700 text-white relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit {selectedOverlay.type.charAt(0).toUpperCase() + selectedOverlay.type.slice(1)} Overlay</h3>
        <button
          onClick={() => removeOverlay(selectedOverlay._id)}
          className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
        >
          Delete
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={selectedOverlay.name}
          onChange={(e) => handleUpdate('name', e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Visible</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedOverlay.visible}
            onChange={(e) => handleUpdate('visible', e.target.checked)}
            className="w-4 h-4 mr-2"
          />
          <span>Show this overlay</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Z-Index</label>
          <input
            type="number"
            value={selectedOverlay.zIndex}
            onChange={(e) => handleUpdate('zIndex', Number(e.target.value))}
            min={1}
            max={100}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <p className="text-xs text-gray-400 mt-1">Higher values appear on top</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Opacity</label>
          <input
            type="range"
            value={selectedOverlay.style.opacity}
            onChange={(e) => handleStyleUpdate('opacity', Number(e.target.value))}
            min={0}
            max={1}
            step={0.1}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>Opacity: {Math.round(selectedOverlay.style.opacity * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Type-specific controls */}
      {renderTextOverlayControls()}
      {renderImageOverlayControls()}
      
      {/* Position information */}
      <div className="mt-4 text-xs text-gray-400">
        <p>Position: X: {selectedOverlay.position.x}, Y: {selectedOverlay.position.y}</p>
        <p>Size: {selectedOverlay.size.width} x {selectedOverlay.size.height}</p>
      </div>
      
      {/* Color picker popup */}
      {showColorPicker && (
        <div className="absolute z-10 bg-gray-900 border border-gray-700 p-3 rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {colorPickerType === 'text' ? 'Text Color' : 'Background Color'}
            </span>
            <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-white">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <HexColorPicker
            color={
              colorPickerType === 'text' 
                ? (selectedOverlay as TextOverlay).style.color 
                : (selectedOverlay as TextOverlay).style.backgroundColor
            }
            onChange={handleColorChange}
          />
          
          <div className="mt-2">
            <input
              type="text"
              value={
                colorPickerType === 'text' 
                  ? (selectedOverlay as TextOverlay).style.color 
                  : (selectedOverlay as TextOverlay).style.backgroundColor
              }
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full p-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            {colorPickerType === 'background' && (
              <button
                onClick={() => handleColorChange('transparent')}
                className="w-full mt-2 p-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Set Transparent
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to determine text color based on background
function getContrastColor(hexColor: string) {
  if (hexColor === 'transparent') return 'black';
  
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  
  if (hexColor.startsWith('#')) {
    if (hexColor.length === 4) {
      r = parseInt(hexColor[1] + hexColor[1], 16);
      g = parseInt(hexColor[2] + hexColor[2], 16);
      b = parseInt(hexColor[3] + hexColor[3], 16);
    } else if (hexColor.length === 7) {
      r = parseInt(hexColor.substring(1, 3), 16);
      g = parseInt(hexColor.substring(3, 5), 16);
      b = parseInt(hexColor.substring(5, 7), 16);
    }
  }
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}