import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import StreamSettingsModel from '@/lib/models/StreamSettings';

// GET stream settings
export async function GET() {
  try {
    await connectToDatabase();

    // Get the most recent stream settings
    const settings = await StreamSettingsModel.findOne()
      .sort({ lastUpdated: -1 })
      .limit(1);
    
    // If no settings exist, return default values
    if (!settings) {
      return NextResponse.json({
        rtspUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
        name: 'Default Stream',
        autoPlay: true,
        showControls: true,
        defaultVolume: 0.5
      }, { status: 200 });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('GET /api/stream-settings error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stream settings', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST new stream settings
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get the data from the request
    const data = await request.json();
    
    // Check if the required fields are present
    if (!data.rtspUrl) {
      return NextResponse.json(
        { message: 'Missing required field: rtspUrl' },
        { status: 400 }
      );
    }

    // Create new settings with defaults for missing fields
    const newSettings = new StreamSettingsModel({
      rtspUrl: data.rtspUrl,
      name: data.name || 'Stream',
      description: data.description,
      autoPlay: data.autoPlay !== undefined ? data.autoPlay : true,
      showControls: data.showControls !== undefined ? data.showControls : true,
      defaultVolume: data.defaultVolume !== undefined ? data.defaultVolume : 0.5,
      lastUpdated: new Date()
    });

    await newSettings.save();

    return NextResponse.json(newSettings, { status: 201 });
  } catch (error) {
    console.error('POST /api/stream-settings error:', error);
    return NextResponse.json(
      { message: 'Failed to save stream settings', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT update stream settings (only the most recent one)
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const data = await request.json();
    
    // Check if the required fields are present
    if (!data.rtspUrl) {
      return NextResponse.json(
        { message: 'Missing required field: rtspUrl' },
        { status: 400 }
      );
    }

    // Get the most recent settings
    const currentSettings = await StreamSettingsModel.findOne()
      .sort({ lastUpdated: -1 })
      .limit(1);
    
    if (currentSettings) {
      // Update existing settings
      Object.assign(currentSettings, {
        ...data,
        lastUpdated: new Date()
      });
      
      await currentSettings.save();
      return NextResponse.json(currentSettings, { status: 200 });
    } else {
      // Create new settings if none exist
      const newSettings = new StreamSettingsModel({
        rtspUrl: data.rtspUrl,
        name: data.name || 'Stream',
        description: data.description,
        autoPlay: data.autoPlay !== undefined ? data.autoPlay : true,
        showControls: data.showControls !== undefined ? data.showControls : true,
        defaultVolume: data.defaultVolume !== undefined ? data.defaultVolume : 0.5,
        lastUpdated: new Date()
      });
      
      await newSettings.save();
      return NextResponse.json(newSettings, { status: 201 });
    }
  } catch (error) {
    console.error('PUT /api/stream-settings error:', error);
    return NextResponse.json(
      { message: 'Failed to update stream settings', error: (error as Error).message },
      { status: 500 }
    );
  }
}