import { NextResponse } from 'next/server';
import clientPromise from '../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('assignment');
  const items = await db.collection('details').find({}).toArray();

  return NextResponse.json(items);
}
