import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cva } from 'class-variance-authority';
import { ShoppingCart, Eye, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg",
                outline: "border-2 border-primary text-primary hover:bg-primary/10",
                ghost: "hover:bg-accent/20 text-text-main hover:text-primary",
                secondary: "bg-secondary text-white hover:bg-secondary-hover",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function ProductCard({ product, onAddToCart, className }) {
    const { id, nombre, precio, avatar, stock } = product;
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    // Parse avatar safely
    const getMainImage = () => {
        if (!avatar) return null;
        if (Array.isArray(avatar)) return avatar[0];
        try {
            const parsed = JSON.parse(avatar);
            if (Array.isArray(parsed)) return parsed[0];
            return avatar; // Fallback if it's a simple string
        } catch (e) {
            return avatar; // Fallback if it's a simple string
        }
    };

    const mainImage = getMainImage();

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={cn(
                "group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100",
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                {mainImage ? (
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={mainImage}
                        alt={nombre}
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <ImageIcon className="text-gray-300 w-12 h-12" />
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Link
                        to={`/product/${id}`}
                        className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "translate-y-4 group-hover:translate-y-0 transition-transform duration-300")}
                    >
                        <Eye size={20} />
                    </Link>
                    {onAddToCart && (
                        <button
                            onClick={() => onAddToCart(product)}
                            disabled={stock === 0}
                            className={cn(buttonVariants({ variant: "default", size: "icon" }), "translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75")}
                        >
                            <ShoppingCart size={20} />
                        </button>
                    )}
                </div>

                {/* Stock Badge */}
                {stock === 0 && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Agotado
                    </div>
                )}
                {stock > 0 && stock < 5 && (
                    <div className="absolute top-2 right-2 bg-accent text-text-main text-xs font-bold px-2 py-1 rounded-full">
                        ¡Últimos {stock}!
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-text-main text-lg truncate" title={nombre}>
                        {nombre}
                    </h3>
                    <p className="text-primary font-bold text-xl">
                        {CURRENCY_SYMBOL}{precio.toLocaleString('es-AR')}
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        to={`/product/${id}`}
                        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                    >
                        Ver Detalles
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export { ProductCard, buttonVariants };
export default ProductCard;
