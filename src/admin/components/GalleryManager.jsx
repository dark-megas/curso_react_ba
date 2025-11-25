import React, { useState } from 'react';
import { useProductImages } from '../../hooks/useProductImages';
import { Upload, Trash2, Image as ImageIcon, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GalleryManager = ({ onSelect, multiSelect = false, selectedImages = [] }) => {
    const { images, loading, error, uploadImage, deleteImage } = useProductImages();
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        await uploadImage(file);
        setUploading(false);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar esta imagen?')) {
            await deleteImage(id);
        }
    };

    const handleImageClick = (img) => {
        if (onSelect) {
            onSelect(img.url);
        }
    };

    const isSelected = (url) => {
        if (multiSelect) {
            return selectedImages.includes(url);
        }
        return selectedImages === url;
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleUpload(e.target.files[0])}
                    accept="image/*"
                    disabled={uploading}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    ) : (
                        <>
                            <Upload size={32} className={dragActive ? 'text-orange-500' : 'text-slate-400'} />
                            <p className="font-medium">
                                {dragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para subir'}
                            </p>
                            <p className="text-xs text-slate-400">PNG, JPG, WEBP hasta 5MB</p>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
                {loading && images.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-slate-400">Cargando galería...</div>
                ) : images.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-slate-400">No hay imágenes en la galería</div>
                ) : (
                    images.map((img) => (
                        <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected(img.url)
                                    ? 'border-orange-500 ring-2 ring-orange-200'
                                    : 'border-transparent hover:border-slate-200'
                                }`}
                            onClick={() => handleImageClick(img)}
                        >
                            <img
                                src={img.url}
                                alt={img.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Selection Indicator */}
                            {isSelected(img.url) && (
                                <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-sm z-10">
                                    <Check size={12} />
                                </div>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={(e) => handleDelete(img.id, e)}
                                    className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Name Label */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white truncate">
                                {img.name}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GalleryManager;
