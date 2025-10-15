import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import OverlayModel from '@/lib/models/Overlay';
import mongoose from 'mongoose';

// GET a specific overlay by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const { id } = params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid overlay ID format' },
        { status: 400 }
      );
    }

    const overlay = await OverlayModel.findById(id);
    
    if (!overlay) {
      return NextResponse.json(
        { message: 'Overlay not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(overlay, { status: 200 });
  } catch (error) {
    console.error(`GET /api/overlays/[id] error:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch overlay', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT (update) a specific overlay by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const { id } = params;
    
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid overlay ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Check if the overlay exists
    const existingOverlay = await OverlayModel.findById(id);
    if (!existingOverlay) {
      return NextResponse.json(
        { message: 'Overlay not found' },
        { status: 404 }
      );
    }

    // Prevent changing the overlay type
    if (data.type && data.type !== existingOverlay.type) {
      return NextResponse.json(
        { message: 'Cannot change overlay type' },
        { status: 400 }
      );
    }

    // Update the overlay
    const updatedOverlay = await OverlayModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedOverlay, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/overlays/[id] error:`, error);
    return NextResponse.json(
      { message: 'Failed to update overlay', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE a specific overlay by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const { id } = params;
    
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid overlay ID format' },
        { status: 400 }
      );
    }

    // Check if the overlay exists
    const existingOverlay = await OverlayModel.findById(id);
    if (!existingOverlay) {
      return NextResponse.json(
        { message: 'Overlay not found' },
        { status: 404 }
      );
    }

    // Delete the overlay
    await OverlayModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Overlay deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/overlays/[id] error:`, error);
    return NextResponse.json(
      { message: 'Failed to delete overlay', error: (error as Error).message },
      { status: 500 }
    );
  }
}