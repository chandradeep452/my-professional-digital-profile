import { AuthUser, UserRole, Student, StudentSubmissionPayload } from '@/types';
import {
  DbUserRow,
  neonCreateUser,
  neonGetUserByEmail,
  neonGetUserByStudentId,
  neonGetUserById,
  neonGetAllStudents,
  neonGetStudentById,
  neonGetStudentByStudentId,
  neonGetStudentByUserId,
  neonSaveStudent,
  neonDeleteStudentById,
  neonSaveUploadedFile,
  neonGetUploadedFile,
} from './neon-db';
import {
  localCreateUser,
  localGetUserByEmail,
  localGetUserByStudentId,
  localGetUserById,
  localGetAllStudents,
  localGetStudentById,
  localGetStudentByStudentId,
  localGetStudentByUserId,
  localSaveStudent,
  localDeleteStudentById,
  localSaveUploadedFile,
  localGetUploadedFile,
} from './local-sqlite';

export type { DbUserRow };

function useLocalSqlite(): boolean {
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isVercel) return false;
  return process.env.USE_LOCAL_DB === 'true';
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  companyName?: string;
  studentId?: string;
}): Promise<AuthUser> {
  return useLocalSqlite() ? localCreateUser(input) : neonCreateUser(input);
}

export async function getUserByEmail(email: string): Promise<DbUserRow | null> {
  return useLocalSqlite() ? localGetUserByEmail(email) : neonGetUserByEmail(email);
}

export async function getUserByStudentId(studentId: string): Promise<DbUserRow | null> {
  return useLocalSqlite() ? localGetUserByStudentId(studentId) : neonGetUserByStudentId(studentId);
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  return useLocalSqlite() ? localGetUserById(id) : neonGetUserById(id);
}

export async function getAllStudents(filters?: {
  search?: string;
  branch?: string;
  year?: number;
}): Promise<Student[]> {
  return useLocalSqlite() ? localGetAllStudents(filters) : neonGetAllStudents(filters);
}

export async function getStudentById(id: string): Promise<Student | null> {
  return useLocalSqlite() ? localGetStudentById(id) : neonGetStudentById(id);
}

export async function getStudentByStudentId(studentId: string): Promise<Student | null> {
  return useLocalSqlite() ? localGetStudentByStudentId(studentId) : neonGetStudentByStudentId(studentId);
}

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  return useLocalSqlite() ? localGetStudentByUserId(userId) : neonGetStudentByUserId(userId);
}

export async function saveStudent(
  payload: StudentSubmissionPayload,
  ownerUserId?: string
): Promise<Student> {
  return useLocalSqlite()
    ? localSaveStudent(payload, ownerUserId)
    : neonSaveStudent(payload, ownerUserId);
}

export async function deleteStudentById(id: string): Promise<boolean> {
  return useLocalSqlite() ? localDeleteStudentById(id) : neonDeleteStudentById(id);
}

export async function saveUploadedFile(input: {
  pathKey: string;
  mimeType: string;
  originalName: string;
  buffer: Buffer;
}): Promise<void> {
  return useLocalSqlite() ? localSaveUploadedFile(input) : neonSaveUploadedFile(input);
}

export async function getUploadedFile(
  pathKey: string
): Promise<{ mimeType: string; originalName: string; buffer: Buffer } | null> {
  return useLocalSqlite() ? localGetUploadedFile(pathKey) : neonGetUploadedFile(pathKey);
}
