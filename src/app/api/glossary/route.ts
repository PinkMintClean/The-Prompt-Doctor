import { NextResponse } from 'next/server';
import { glossaryData } from '@/lib/data';

export async function GET() {
  return NextResponse.json(glossaryData);
}