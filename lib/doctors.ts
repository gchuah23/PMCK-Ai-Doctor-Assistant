import doctors from '../data/doctor_list.json';

/**
 * A doctor record as loaded from the canonical doctor_list.json.
 */
export interface DoctorRecord {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  profileUrl: string;
}

// Cast the imported JSON to our interface array.
export const DOCTORS: DoctorRecord[] = doctors as DoctorRecord[];

/**
 * A Map keyed by the doctor id for quick lookup. Useful for validation or
 * referencing a doctor by ID.
 */
export const DOCTOR_INDEX = new Map<string, DoctorRecord>(
  DOCTORS.map((d) => [d.id, d])
);