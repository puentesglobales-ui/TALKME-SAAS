import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete, isProcessing }) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            console.log("🎤 Iniciando acceso al micrófono...");

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Tu navegador no soporta la grabación de audio o no estás en un entorno seguro (HTTPS).");
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("✅ Acceso al micrófono concedido.");

            // Detectar el formato soportado por el navegador
            const mimeTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/mp4',
                'audio/aac'
            ];

            let mimeType = '';
            for (const type of mimeTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    mimeType = type;
                    break;
                }
            }

            console.log(`🎤 Usando MIME Type: ${mimeType}`);
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                console.log(`🎤 Grabación finalizada: ${blob.size} bytes (${mimeType})`);
                onRecordingComplete(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("❌ Error accediendo al micrófono:", err);
            let userMessage = "No se pudo acceder al micrófono. ";
            if (err.name === 'NotAllowedError') userMessage += "Por favor, permite el acceso al micrófono en la configuración de tu navegador.";
            else if (err.name === 'NotFoundError') userMessage += "No se encontró ningún micrófono conectado.";
            else userMessage += err.message;
            alert(userMessage);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <button
                type="button" // Prevent form submit if inside form
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`
          flex items-center justify-center p-4 rounded-full transition-all duration-300
          ${isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        `}
            >
                {isProcessing ? (
                    <Loader2 className="animate-spin text-white" size={24} />
                ) : isRecording ? (
                    <Square className="text-white fill-current" size={24} />
                ) : (
                    <Mic className="text-white" size={24} />
                )}
            </button>
            {isRecording && (
                <span className="ml-2 text-xs text-red-400 font-mono animate-pulse">
                    Grabando...
                </span>
            )}
        </div>
    );
}
