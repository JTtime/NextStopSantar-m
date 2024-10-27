import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updatedData = await request.json();

  const client = await clientPromise;
  const db = client.db('assignment'); // Replace with your database name

  const result = await db.collection('details').updateOne(
    { id: id },
    { $set: updatedData }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Item updated successfully' });
}
