import { NextResponse } from 'next/server';
import clientPromise from '../lib/mongodb';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updatedData = await request.json();

  const client = await clientPromise;
  const db = client.db('assignment'); // Replace with your database name

  const existingItem = await db.collection('details').findOne({ id: id });
  if (!existingItem) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const newValue = JSON.parse(existingItem.value);
  const newType = JSON.parse(existingItem.type);

  // Update key and update respective value and type accordingly
  if (updatedData.key) {
    newValue[updatedData.key] = newValue[existingItem.key]; // Preserve old data
    delete newValue[existingItem.key]; // Remove old key
  }

  // Set modified date and update value/type if they are present in the request
  const result = await db.collection('details').updateOne(
    { id: id },
    {
      $set: {
        ...updatedData,
        value: JSON.stringify(newValue),
        type: JSON.stringify(newType),
        modified: new Date(),
      },
    }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: 'No changes made' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Item updated successfully' });
}
