import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('=== ADMIN CONTACTS API DEBUG ===');
    
    // Simple authentication check (you can enhance this)
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;
    
    console.log('Auth header:', authHeader);
    console.log('Admin key from env:', adminKey);
    console.log('Auth header matches:', authHeader === `Bearer ${adminKey}`);

    if (!authHeader || !adminKey || authHeader !== `Bearer ${adminKey}`) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized access', details: 'Invalid admin key' },
        { status: 401 }
      );
    }

    console.log('Authentication successful, connecting to database...');

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('Database connected:', db.databaseName);

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const status = url.searchParams.get('status');

    console.log('Query params - limit:', limit, 'status:', status);

    // Build query
    const query = status ? { status } : {};
    console.log('MongoDB query:', query);

    // Check if contacts collection exists
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Fetch contacts from the database
    const contacts = await db
      .collection('contacts')
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .toArray();

    console.log('Contacts found:', contacts.length);

    // Get total count
    const totalCount = await db.collection('contacts').countDocuments(query);
    console.log('Total contacts in database:', totalCount);

    return NextResponse.json(
      {
        success: true,
        contacts,
        totalCount,
        limit,
        debug: {
          collectionsAvailable: collections.map(c => c.name),
          databaseName: db.databaseName
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('=== ADMIN CONTACTS API ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          envVars: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasAdminKey: !!process.env.ADMIN_SECRET_KEY,
            mongoDb: process.env.MONGODB_DB
          }
        } : undefined
      },
      { status: 500 }
    );
  }
}

// Update contact status
export async function PATCH(request: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;

    if (!authHeader || !adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contactId, status } = body;

    if (!contactId || !status) {
      return NextResponse.json(
        { error: 'Missing contactId or status' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Update contact status
    const result = await db.collection('contacts').updateOne(
      { _id: contactId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Contact status updated successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Admin contact update error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 