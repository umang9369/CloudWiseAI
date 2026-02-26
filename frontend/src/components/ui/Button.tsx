import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'icon';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
    const baseStyles = 'font-display uppercase tracking-[0.15em] transition-colors focus:outline-none flex justify-center items-center';

    const variants = {
        primary: 'bg-accent-red text-white-glyph py-2.5 px-6 text-micro font-bold hover:bg-accent-red-dim border-none',
        ghost: 'bg-transparent text-text-secondary border border-text-muted py-2.5 px-6 text-micro hover:border-accent-red hover:text-white-glyph',
        icon: 'bg-surface border border-border p-2 hover:border-accent-red text-text-secondary hover:text-white-glyph'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
