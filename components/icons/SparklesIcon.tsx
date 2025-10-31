
import React from 'react';

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-.861.41-1.652 1.08-2.174Z"
      clipRule="evenodd"
    />
    <path d="M11.964 3.32a.75.75 0 01.336 1.324l-3.32 1.107-1.107 3.32a.75.75 0 01-1.325-.337l-1.107-3.32-3.32-1.107a.75.75 0 01.337-1.325l3.32 1.107 1.107-3.32a.75.75 0 011.325.337l1.107 3.32 3.32 1.107a.75.75 0 01-.337 1.325L11.964 3.32z" />
  </svg>
);

export default SparklesIcon;
