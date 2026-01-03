import {z} from "zod";

export const UserSchema = z.object({
  username: z.string().min(1, "username tidak boleh kosong"),
  password: z.string().min(1, "username tidak boleh kosong"),
  role: z.string().min(1, "username tidak boleh kosong"),
});

export type UserReq = z.infer<typeof UserSchema>;