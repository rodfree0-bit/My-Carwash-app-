import React, { useState, useEffect, useRef } from 'react';

const services = [
    {
        image: '/ceramic_coating.png',
        title: 'Ceramic Coating',
        description: 'Ultimate protection with a stunning glass-like shine that lasts.',
        icon: 'auto_awesome'
    },
    {
        image: '/wheel_polish.png',
        title: 'Wheel Perfection',
        description: 'Flawless mirror finish that turns heads everywhere you go.',
        icon: 'tire_repair'
    },
    {
        image: '/paint_restoration.png',
        title: 'Paint Revival',
        description: 'Bring back that showroom brilliance to your vehicle.',
        icon: 'format_paint'
    },
    {
        image: '/interior_detail.png',
        title: 'Interior Luxury',
        description: 'A spotless sanctuary with that new car feel and scent.',
        icon: 'airline_seat_recline_extra'
    }
];

export const ServiceShowcase: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % services.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Scroll to active card
    useEffect(() => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.scrollWidth / services.length;
            scrollRef.current.scrollTo({
                left: activeIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    return (
        <div className="mb-6">
            <h3 className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3 px-1">
                ✨ Nuestros Servicios
            </h3>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {services.map((service, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-300 snap-center ${activeIndex === index ? 'scale-100 shadow-xl shadow-primary/20' : 'scale-95 opacity-80'
                            }`}
                    >
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-primary text-lg">{service.icon}</span>
                                <h4 className="font-bold text-white">{service.title}</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 mt-3">
                {services.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? 'bg-primary w-6' : 'bg-slate-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
