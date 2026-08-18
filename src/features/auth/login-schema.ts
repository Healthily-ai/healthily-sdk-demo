import type { FormikErrors } from 'formik';
import { z } from 'zod';

/** Both fields are required (non-empty) — and nothing more. */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

/** Tiny zod -> Formik adapter so we don't need an extra dependency. */
export function validateLogin(values: LoginValues): FormikErrors<LoginValues> {
  const result = loginSchema.safeParse(values);
  if (result.success) return {};

  const errors: FormikErrors<LoginValues> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !errors[key as keyof LoginValues]) {
      errors[key as keyof LoginValues] = issue.message;
    }
  }
  return errors;
}
