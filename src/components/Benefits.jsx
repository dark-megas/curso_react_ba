import React from 'react';
import { Truck, ShieldCheck, Star, CreditCard } from 'lucide-react';

function Benefits() {
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const freeShippingThreshold = parseFloat(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD || '50000').toLocaleString('es-AR');

    const benefits = [
        {
            icon: Truck,
            title: "Envío Gratis",
            description: `En compras superiores a ${CURRENCY_SYMBOL}${freeShippingThreshold}`,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: ShieldCheck,
            title: "Compra Segura",
            description: "Tus datos están protegidos con cifrado SSL",
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            icon: Star,
            title: "Calidad Garantizada",
            description: "Seleccionamos solo lo mejor para tu mascota",
            color: "text-yellow-500",
            bg: "bg-yellow-50"
        },
        {
            icon: CreditCard,
            title: "Todos los Medios",
            description: "Aceptamos tarjetas, efectivo y transferencias",
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-gray-50"
                        >
                            <div className={`p-4 rounded-full mb-4 ${benefit.bg} ${benefit.color}`}>
                                <benefit.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-2">{benefit.title}</h3>
                            <p className="text-sm text-text-muted">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Benefits;
