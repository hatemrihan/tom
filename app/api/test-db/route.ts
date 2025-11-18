import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_DB:', process.env.MONGODB_DB);

    const { db } = await connectToDatabase();
    
    // Test the connection by getting database stats
    const admin = db.admin();
    const result = await admin.ping();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      ping: result,
      database: db.databaseName,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      envCheck: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoDbName: process.env.MONGODB_DB || 'not set'
      }
    }, { status: 500 });
  }
} 