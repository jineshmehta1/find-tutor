"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    X, Check, ZoomIn, ZoomOut, RotateCw, RotateCcw, Move, Sparkles
} from "lucide-react";

export interface ImageCropModalProps {
    isOpen: boolean;
    imageFile: File | null;
    onClose: () => void;
    onCropComplete: (croppedFile: File) => void | Promise<void>;
    title?: string;
    description?: string;
}

const CANVAS_SIZE = 500; // High-res 500x500 output

export default function ImageCropModal({
    isOpen,
    imageFile,
    onClose,
    onCropComplete,
    title = "Crop & Adjust Photo",
    description = "Drag to reposition, use zoom or rotate to frame your face perfectly."
}: ImageCropModalProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
    const [zoom, setZoom] = useState<number>(1);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [posAtDragStart, setPosAtDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    // Reset settings when a new image is provided
    useEffect(() => {
        if (!imageFile || !isOpen) {
            setLoadedImage(null);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            setRotation(0);
            return;
        }

        const objectUrl = URL.createObjectURL(imageFile);
        const img = new Image();
        img.onload = () => {
            setLoadedImage(img);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            setRotation(0);
        };
        img.src = objectUrl;

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [imageFile, isOpen]);

    // Redraw canvas whenever zoom, position, rotation, or loadedImage changes
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !loadedImage) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Fill background with white in case of transparent PNGs
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.save();
        // Translate to canvas center
        ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);
        // Apply zoom
        ctx.scale(zoom, zoom);
        // Apply pan translation
        ctx.translate(position.x, position.y);

        // Compute base dimensions to cover the 500x500 box
        const aspect = loadedImage.naturalWidth / loadedImage.naturalHeight;
        let baseW = CANVAS_SIZE;
        let baseH = CANVAS_SIZE;
        if (aspect > 1) {
            baseH = CANVAS_SIZE;
            baseW = CANVAS_SIZE * aspect;
        } else {
            baseW = CANVAS_SIZE;
            baseH = CANVAS_SIZE / aspect;
        }

        ctx.drawImage(loadedImage, -baseW / 2, -baseH / 2, baseW, baseH);
        ctx.restore();
    }, [loadedImage, zoom, position, rotation]);

    useEffect(() => {
        draw();
    }, [draw]);

    // Pointer event handlers for drag / pan
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setPosAtDragStart({ ...position });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scaleFactor = CANVAS_SIZE / rect.width;

        const dx = (e.clientX - dragStart.x) * scaleFactor;
        const dy = (e.clientY - dragStart.y) * scaleFactor;

        // Counter-rotate the delta so panning follows natural mouse direction regardless of rotation
        const rad = (-rotation * Math.PI) / 180;
        const rotX = dx * Math.cos(rad) - dy * Math.sin(rad);
        const rotY = dx * Math.sin(rad) + dy * Math.cos(rad);

        setPosition({
            x: posAtDragStart.x + rotX / zoom,
            y: posAtDragStart.y + rotY / zoom,
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
    };

    // Controls
    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
    };

    const handleApply = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageFile) return;

        setIsProcessing(true);
        try {
            canvas.toBlob(
                async (blob) => {
                    if (!blob) {
                        setIsProcessing(false);
                        return;
                    }
                    const cleanName = imageFile.name.replace(/\.[^/.]+$/, "") + ".jpg";
                    const croppedFile = new File([blob], cleanName, { type: "image/jpeg" });
                    await onCropComplete(croppedFile);
                    setIsProcessing(false);
                },
                "image/jpeg",
                0.95
            );
        } catch (error) {
            console.error("Error cropping image:", error);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-7 space-y-5 shadow-2xl relative border border-slate-200 text-slate-800 flex flex-col max-h-[92vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Photo Adjuster</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">{title}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Cancel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Viewport Area */}
                <div className="flex flex-col items-center justify-center space-y-2 select-none">
                    <div
                        ref={containerRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden shadow-inner bg-slate-900 touch-none cursor-grab active:cursor-grabbing border-2 border-slate-300"
                    >
                        {/* High-res Render Canvas */}
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="w-full h-full object-cover pointer-events-none"
                        />

                        {/* Circular Mask Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            {/* Dark vignette outside circle */}
                            <div className="w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] rounded-full border-2 border-amber-400/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative">
                                {/* Subtle center guidelines */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <div className="w-full h-[1px] bg-white border-t border-dashed border-white/60" />
                                    <div className="h-full w-[1px] bg-white border-l border-dashed border-white/60 absolute" />
                                </div>
                            </div>
                        </div>

                        {/* Hint overlay on bottom */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1.5 border border-white/10 shadow-sm">
                            <Move className="w-3 h-3 text-amber-400" />
                            <span>Drag photo to center face</span>
                        </div>
                    </div>
                </div>

                {/* Zoom & Rotation Controls */}
                <div className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                    {/* Zoom Slider */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-black text-slate-700">
                            <span className="flex items-center gap-1.5">
                                <ZoomIn className="w-3.5 h-3.5 text-amber-600" />
                                <span>Zoom &amp; Scale</span>
                            </span>
                            <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-black cursor-pointer shadow-2xs transition-colors shrink-0"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ffb800]"
                            />
                            <button
                                type="button"
                                onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-black cursor-pointer shadow-2xs transition-colors shrink-0"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Tools: Rotate & Reset */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-xs">
                        <button
                            type="button"
                            onClick={handleRotate}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                        >
                            <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Rotate 90° {rotation > 0 ? `(${rotation}°)` : ""}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-500 font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-black text-xs uppercase tracking-wider transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={isProcessing}
                        className="py-3 px-4 rounded-xl bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <span>Applying Crop...</span>
                        ) : (
                            <>
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Apply &amp; Upload</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

