import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/geminiService';

export async function POST(request: NextRequest) {
	try {
		const contentType = request.headers.get('content-type') || '';

		let audioBlob: Blob;
		let originalLanguage: string | undefined;
		let targetLanguage: string | undefined;

		if (contentType.includes('application/json')) {
			// JSON body: { audio: { data: base64, type, name }, originalLanguage?, targetLanguage? }
			const body = await request.json();
			const { audio, originalLanguage: orig, targetLanguage: targ } = body || {};
			if (!audio || !audio.data) {
				return NextResponse.json({ error: 'No audio data provided' }, { status: 400 });
			}
			const buffer = Buffer.from(audio.data, 'base64');
			audioBlob = new Blob([buffer], { type: audio.type || 'audio/wav' });
			originalLanguage = orig || undefined;
			targetLanguage = targ || undefined;
		} else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
			const formData = await request.formData();
			const audioFile = formData.get('audio') as File | null;
			const orig = formData.get('originalLanguage') as string | null;
			const targ = formData.get('targetLanguage') as string | null;

			if (!audioFile) {
				return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
			}

			// Convert File to Blob
			audioBlob = new Blob([audioFile], { type: audioFile.type });
			originalLanguage = orig || undefined;
			targetLanguage = targ || undefined;
		} else {
			return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
		}

		// Call Gemini service for transcription
		const result = await geminiService.transcribeAudio({
			audioBlob,
			originalLanguage,
			targetLanguage,
		});

		return NextResponse.json({ success: true, data: result });
	} catch (error) {
		console.error('Transcription API error:', error);
		return NextResponse.json(
			{
				error: 'Failed to transcribe audio',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}
