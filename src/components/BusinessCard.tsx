import React from 'react';
import { Link } from 'react-router';

interface Business {
    id: string;
    name: string;
    description: string;
    address: string;
    postalCode: string;
    category: string;
    rating: number;
    imageUrl: string;
}

interface BusinessCardProps {
    business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
    // Función para generar estrellas de calificación
    const renderRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Estrella completa
                stars.push(
                    <svg key={`star-${i}`} className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>,
                );
            } else if (i === fullStars && hasHalfStar) {
                // Media estrella
                stars.push(
                    <svg key={`star-${i}`} className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                        <defs>
                            <linearGradient id={`halfStar-${business.id}`}>
                                <stop offset='50%' stopColor='currentColor' />
                                <stop offset='50%' stopColor='#e5e7eb' />
                            </linearGradient>
                        </defs>
                        <path
                            fill={`url(#halfStar-${business.id})`}
                            d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
                        />
                    </svg>,
                );
            } else {
                // Estrella vacía
                stars.push(
                    <svg key={`star-${i}`} className='w-5 h-5 text-gray-300' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>,
                );
            }
        }

        return (
            <div className='flex items-center'>
                {stars}
                <span className='ml-1 text-gray-600 text-sm'>({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg'>
            <Link to={`/business/${business.id}`} className='block'>
                <div className='h-48 overflow-hidden'>
                    <img
                        src={business.imageUrl}
                        alt={business.name}
                        className='w-full h-full object-cover transition-transform hover:scale-110 duration-500'
                    />
                </div>
                <div className='p-4'>
                    <div className='flex justify-between items-start mb-2'>
                        <h3 className='text-lg font-medium text-gray-900'>{business.name}</h3>
                        <span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded'>
                            {business.category}
                        </span>
                    </div>
                    {renderRatingStars(business.rating)}
                    <p className='mt-2 text-sm text-gray-600 line-clamp-2'>{business.description}</p>
                    <div className='mt-4 text-sm text-gray-500'>
                        <div className='flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                            </svg>
                            <span>{business.address}</span>
                        </div>
                        <div className='flex items-center mt-1'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                            </svg>
                            <span>CP: {business.postalCode}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};
