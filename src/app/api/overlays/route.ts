import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import OverlayModel from '@/lib/models/Overlay';
import mongoose from 'mongoose';

// GET all overlays
export async function GET() {
  try {
    await connectToDatabase();

    const overlays = await OverlayModel.find().sort({ zIndex: 1 });
    
    return NextResponse.json(overlays, { status: 200 });
  } catch (error) {
    console.error('GET /api/overlays error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch overlays', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST a new overlay
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get the data from the request and handle potential parsing errors
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body', error: (parseError as Error).message },
        { status: 400 }
      );
    }
    
    // Check if the required fields are present
    if (!data.type || !data.name) {
      return NextResponse.json(
        { message: 'Missing required fields: type and name' },
        { status: 400 }
      );
    }

    // Set defaults based on the overlay type
    let overlayData;
    
    if (data.type === 'text') {
      overlayData = {
        ...data,
        content: data.content || 'Text Overlay',
        position: data.position || { x: 10, y: 10 },
        size: data.size || { width: 200, height: 80 },
        zIndex: data.zIndex || 1,
        visible: data.visible !== undefined ? data.visible : true,
        style: {
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#ffffff',
          backgroundColor: 'transparent',
          opacity: 1,
          textAlign: 'left',
          ...data.style,
        },
      };
    } else if (data.type === 'image') {
      overlayData = {
        ...data,
        imageUrl: data.imageUrl || '',
        alt: data.alt || 'Image Overlay',
        position: data.position || { x: 10, y: 10 },
        size: data.size || { width: 200, height: 150 },
        zIndex: data.zIndex || 1,
        visible: data.visible !== undefined ? data.visible : true,
        style: {
          opacity: 1,
          border: 'none',
          borderRadius: 0,
          ...data.style,
        },
      };
    } else {
      return NextResponse.json(
        { message: 'Invalid overlay type. Must be "text" or "image"' },
        { status: 400 }
      );
    }

    // Create a new overlay
    const newOverlay = new OverlayModel(overlayData);
    await newOverlay.save();

    return NextResponse.json(newOverlay, { status: 201 });
  } catch (error) {
    console.error('POST /api/overlays error:', error);
    return NextResponse.json(
      { message: 'Failed to create overlay', error: (error as Error).message },
      { status: 500 }
    );
  }
}