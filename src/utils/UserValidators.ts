import { User } from "@/models/User";
import { z } from "zod";

export class UserValidator {
    private static schema = z.object({
        name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
        email: z.string().email("Correo inválido."),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
        age: z.number().optional().refine(age => age === undefined || age > 0, {
            message: "La edad debe ser un número positivo.",
        }),
        city: z.string().optional(),
        phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos.").optional(),
        is_active: z.boolean().optional(),
    });

    static validateField<K extends keyof User>(field: K, value: any) {
        const fieldSchema = this.schema.pick({ [field]: true } as any);
        return fieldSchema.safeParse({ [field]: value });
    }
}
