// This module re-exports our canonical doctor list for backwards compatibility.
// Other parts of the codebase may still import `PMCK_DOCTORS` from this file.
// Going forward, prefer importing { DOCTORS } from './lib/doctors'.

import { DOCTORS } from './lib/doctors';
import type { Doctor } from './types';

// PMCK_DOCTORS is kept for legacy usage; it contains the same records as DOCTORS.
export const PMCK_DOCTORS: Doctor[] = DOCTORS;