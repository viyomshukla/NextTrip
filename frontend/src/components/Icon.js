import React from 'react';

/**
 * Inline stroke icons, sized in em so they scale with surrounding text and
 * inherit currentColor. Emoji were doing this job before, but they render as
 * a different typeface on every OS and read as placeholder art.
 */

const PATHS = {
  sparkle: <path d="M12 2.5 14.2 9.8 21.5 12l-7.3 2.2L12 21.5 9.8 14.2 2.5 12l7.3-2.2z" />,

  compass: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.9 8.1 13.8 14 8.1 15.9 10.2 10z" />
    </>
  ),

  users: (
    <>
      <path d="M16 20.5v-1.75a3.75 3.75 0 0 0-3.75-3.75h-4.5A3.75 3.75 0 0 0 4 18.75v1.75" />
      <circle cx="10" cy="7.5" r="3.75" />
      <path d="M20 20.5v-1.75a3.75 3.75 0 0 0-2.8-3.63M15.2 4.12a3.75 3.75 0 0 1 0 7.02" />
    </>
  ),

  shield: (
    <>
      <path d="M19.5 12c0 4.7-3.3 7.1-7.2 8.4a1 1 0 0 1-.63 0C7.8 19.1 4.5 16.7 4.5 12V6.3a1 1 0 0 1 .94-1c1.9-.1 4.2-1.2 5.85-2.6a1.1 1.1 0 0 1 1.42 0c1.65 1.4 3.95 2.5 5.85 2.6a1 1 0 0 1 .94 1z" />
      <path d="m9.4 11.9 1.9 1.9 3.4-3.6" />
    </>
  ),

  bolt: <path d="M13.4 2.5 4.9 12.8a.6.6 0 0 0 .46.98h4.9l-.66 7.72 8.5-10.3a.6.6 0 0 0-.46-.98h-4.9z" />,

  pin: (
    <>
      <path d="M19.5 10.2c0 4.6-5.1 9.4-6.9 11a.9.9 0 0 1-1.2 0c-1.8-1.6-6.9-6.4-6.9-11a7.5 7.5 0 0 1 15 0" />
      <circle cx="12" cy="10" r="2.75" />
    </>
  ),

  search: (
    <>
      <circle cx="11" cy="11" r="7.25" />
      <path d="m20.5 20.5-4.2-4.2" />
    </>
  ),

  eye: (
    <>
      <path d="M2.6 12.35a.9.9 0 0 1 0-.7 10.4 10.4 0 0 1 18.8 0 .9.9 0 0 1 0 .7 10.4 10.4 0 0 1-18.8 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),

  eyeOff: (
    <>
      <path d="M2.6 12.35a.9.9 0 0 1 0-.7 10.4 10.4 0 0 1 5.2-5.2M10 4.3a10.4 10.4 0 0 1 11.4 7.35.9.9 0 0 1 0 .7 10.5 10.5 0 0 1-3.7 4.6" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2M3.5 3.5l17 17" />
    </>
  ),

  arrowRight: <path d="M4.5 12h15m-6-6.5 6.5 6.5-6.5 6.5" />,

  star: <path d="m12 3.1 2.6 5.6 5.9.75-4.35 4.15 1.1 5.9L12 16.7l-5.25 2.8 1.1-5.9L3.5 9.45l5.9-.75z" />,

  mountain: (
    <>
      <path d="m3 19.5 6.2-11.4 3.5 6.1 2-3.2 6.3 8.5z" />
      <path d="m7.4 12.4 1.8-1 1.6 1.4" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.2V12l3.2 1.9" />
    </>
  ),

  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.75h17M8.25 3.2v3.4M15.75 3.2v3.4" />
    </>
  ),

  map: (
    <>
      <path d="m9 4.2-5.1 2A.9.9 0 0 0 3.3 7v12.1a.6.6 0 0 0 .83.56L9 17.8l6 2 4.87-1.95a.9.9 0 0 0 .6-.85V4.9a.6.6 0 0 0-.83-.56L15 6.2z" />
      <path d="M9 4.2v13.6M15 6.2v13.6" />
    </>
  ),

  chart: <path d="M4 20.2h16M7.5 20.2v-6.4M12 20.2V6.5M16.5 20.2v-9.4" />,

  ticket: (
    <>
      <path d="M4 8.5V6.8a1.3 1.3 0 0 1 1.3-1.3h13.4A1.3 1.3 0 0 1 20 6.8v1.7a3.5 3.5 0 0 0 0 7v1.7a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 17.2v-1.7a3.5 3.5 0 0 0 0-7" />
      <path d="M13.5 5.5v2M13.5 11v2M13.5 16.5v2" />
    </>
  ),

  check: <path d="m4.5 12.5 5 5 10-10.5" />,

  menu: <path d="M4 7h16M4 12h16M4 17h16" />,

  close: <path d="M6 6l12 12M18 6 6 18" />,

  quote: (
    <path d="M9.4 6.5C6.6 7.6 4.7 10.2 4.7 13.4c0 2.4 1.5 4.1 3.6 4.1 1.9 0 3.3-1.4 3.3-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.8.1.4-1.4 1.6-2.6 3.1-3.3zm9 0c-2.8 1.1-4.7 3.7-4.7 6.9 0 2.4 1.5 4.1 3.6 4.1 1.9 0 3.3-1.4 3.3-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.8.1.4-1.4 1.6-2.6 3.1-3.3z" />
  ),

  globe: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M3.4 12h17.2M12 3.25c2.2 2.4 3.4 5.5 3.4 8.75S14.2 18.35 12 20.75c-2.2-2.4-3.4-5.5-3.4-8.75S9.8 5.65 12 3.25" />
    </>
  ),

  headset: (
    <>
      <path d="M4.2 14.5v-2.3a7.8 7.8 0 0 1 15.6 0v2.3" />
      <path d="M19.8 15.4a2.2 2.2 0 0 1-2.2 2.2h-.6v-4.9h.6a2.2 2.2 0 0 1 2.2 2.2zM4.2 15.4a2.2 2.2 0 0 0 2.2 2.2H7v-4.9h-.6a2.2 2.2 0 0 0-2.2 2.2z" />
      <path d="M19 17.8v.4a2.6 2.6 0 0 1-2.6 2.6H13" />
    </>
  ),
};

/** Icons that read as a solid mark rather than an outline. */
const FILLED = new Set(['star', 'sparkle', 'quote']);

const Icon = ({ name, size = '1.25em', className = '', strokeWidth = 1.7, ...rest }) => {
  const glyph = PATHS[name];
  if (!glyph) return null;
  const filled = FILLED.has(name);

  return (
    <svg
      className={className ? `nt-icon ${className}` : 'nt-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  );
};

export default Icon;
