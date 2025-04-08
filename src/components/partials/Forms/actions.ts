// "use server";
//
// import { revalidateTag } from "next/cache";
// import { cookies } from "next/headers";
// import { typeToFlattenedError } from "zod";
// import {User} from "@/interfaces/User";
//
// interface IActionResponse<T, E> {
//     success: boolean;
//     error: null | typeToFlattenedError<E> | string;
//     data: null | T;
// }
//
// export const logInAction = async (
//     _prevState: unknown,
//     formData: FormData
// ): Promise<IActionResponse<User, loginFormSchemaValues>> => {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
//
//     const values = { email, password };
//
//     const validateFields = logInFormSchema.safeParse(values);
//
//     if (!validateFields.success) {
//         return {
//             success: false,
//             error: validateFields.error.flatten(),
//             data: null,
//         };
//     }
//
//     const newUserData = await logIn(values as loginFormSchemaValues);
//
//     if (newUserData.status === "success") {
//         cookies().set("jwt", newUserData.token);
//
//         revalidateTag("user");
//
//         return {
//             success: true,
//             error: null,
//             data: newUserData.data.user,
//         };
//     }
//
//     return {
//         success: false,
//         error: newUserData.message,
//         data: null,
//     };
// };