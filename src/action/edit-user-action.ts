"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { NewUserSchema, NewUserSchemaType } from "@/schemas/new-user.schema";
import {
  editProfileSchemaType,
  editProfileSchemaTransformed,
} from "@/schemas/edit-profile.schema";

import {
  LinkConsumerUnitSchema,
  LinkConsumerUnitSchemaType,
} from "@/schemas/link-consumer-unit.schema";

export interface LinkConsumerUnitDataType {
  numero: string;
}

export async function linkConsumerUnitAction(
  formData: LinkConsumerUnitSchemaType
): Promise<{ success: boolean; message: string }> {
  try {
    const result = LinkConsumerUnitSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: LinkConsumerUnitDataType = {
      numero: newFormData.number,
    };

    const response = await api
      .patch(`/consumer-units/me`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "A unidade consumidora foi atrelada com sucesso",
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Unidade consumidora não encontrada",
      };
    }

    if (response.statusCode === 409) {
      return {
        success: false,
        message: "A Unidade Consumidora já pertence a outro usuário",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao vincular a unidade consumidora. Exceção: " + error,
    };
  }
}

export async function userProfileEditAction(
  formData: editProfileSchemaType
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const result = editProfileSchemaTransformed.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: editProfileSchemaType = {
      email: newFormData.email,
      nome: newFormData.nome,
      password: newFormData.password,
      confirmPassword: newFormData.password,
    };

    const response = await api
      .patch(
        `/users`,
        {
          name: parsedData.nome,
          email: parsedData.email,
          password: parsedData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Usuário editado com sucesso",
        data: response.data,
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    return {
      success: false,
      message:
        typeof response.message === "object"
          ? response.message.join(", ")
          : response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar o usuário. Exceção: " + error,
    };
  }
}

export async function adminEditUserAction(
  formData: NewUserSchemaType,
  cod_usuario: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = NewUserSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: NewUserSchemaType = {
      name: newFormData.name,
      email: newFormData.email,
      role: newFormData.role,
    };

    const response = await api
      .patch(`/users/${cod_usuario}`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Usuário editado com sucesso",
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar o usuário. Exceção: " + error,
    };
  }
}
