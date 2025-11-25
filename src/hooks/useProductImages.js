import { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

export const useProductImages = () => {
    const { supabase } = useSupabase();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todas las imágenes de la galería
    const fetchImages = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('product_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setImages(data || []);
            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener imágenes:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Subir una nueva imagen
    const uploadImage = async (file, name, description) => {
        try {
            setLoading(true);
            setError(null);

            // 1. Subir archivo al Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública (o firmada si es privado, pero asumimos público por requerimiento de "url que expiren en 1 año" o similar, aunque storage público es más fácil para e-commerce)
            // El usuario pidió "generar url ... que expiren en 1 año". Esto sugiere Signed URLs.

            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('images')
                .createSignedUrl(filePath, 31536000); // 1 año en segundos

            if (signedUrlError) throw signedUrlError;

            const publicUrl = signedUrlData.signedUrl;

            // 3. Guardar registro en la base de datos
            const { data, error: dbError } = await supabase
                .from('product_images')
                .insert([
                    {
                        name: name || file.name,
                        description: description,
                        url: publicUrl,
                        // created_at y updated_at se manejan por default/trigger
                    }
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            setImages(prev => [data, ...prev]);
            return { data, error: null };

        } catch (err) {
            console.error('Error al subir imagen:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar una imagen
    const deleteImage = async (id, url) => {
        try {
            setLoading(true);
            setError(null);

            // 1. Eliminar de la base de datos
            const { error: dbError } = await supabase
                .from('product_images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Eliminar del storage (Opcional: extraer path de la URL)
            // La URL firmada es compleja, pero si guardamos el path en la DB sería mejor. 
            // Como el schema dado solo tiene URL, es difícil borrar del storage sin saber el path exacto.
            // Intentaremos extraer el path si es posible, o solo borramos de la DB.
            // Nota: Para borrar del storage necesitamos el path relativo dentro del bucket.
            // Si la URL es firmada, contiene tokens. 
            // Asumiremos que por ahora solo borramos el registro de la DB para no complicar con parsing de URL firmada.

            setImages(prev => prev.filter(img => img.id !== id));
            return { error: null };
        } catch (err) {
            console.error('Error al eliminar imagen:', err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return {
        images,
        loading,
        error,
        fetchImages,
        uploadImage,
        deleteImage
    };
};
