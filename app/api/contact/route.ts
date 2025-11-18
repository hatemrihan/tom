import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, phone, message, companyName, projectType } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Create the contact document
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      companyName: companyName?.trim() || null,
      projectType: projectType?.trim() || null,
     
      message: message?.trim() || null,
      submittedAt: new Date(),
      status: 'unread',
      source: 'stepper-contact-form'
    };

    // Insert into the contacts collection
    const result = await db.collection('contacts').insertOne(contactData);

    if (result.acknowledged) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Contact form submitted successfully',
          contactId: result.insertedId
        },
        { status: 201 }
      );
    } else {
      throw new Error('Failed to insert contact data');
    }

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint is working. Use POST to submit contact forms.' },
    { status: 200 }
  );
} 