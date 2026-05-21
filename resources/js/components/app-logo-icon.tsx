import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Esquina superior izquierda */}
            <path d="M3 3h7v7H3V3zm2 2v3h3V5H5z" />
            {/* Esquina superior derecha */}
            <path d="M14 3h7v7h-7V3zm2 2v3h3V5h-3z" />
            {/* Esquina inferior izquierda */}
            <path d="M3 14h7v7H3v-7zm2 2v3h3v-3H5z" />
            {/* Módulos sueltos (zona de datos) */}
            <path d="M14 14h2v2h-2v-2zM19 14h2v2h-2v-2zM16 16h2v2h-2v-2zM14 18h2v2h-2v-2zM19 18h2v2h-2v-2z" />
        </svg>
    );
}
