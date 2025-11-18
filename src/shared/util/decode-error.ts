import { AxiosError } from "axios";

const decodeError = (error: any): string => {
  if (error.message === "Network Error")
    error = "Ocorreu um erro inesperado na rede!";
  if (typeof error !== "string") {
    const axiosError = error as AxiosError<any>;
    error = axiosError.response?.data.message;
  }
  if (error === "timeout")
    return "Não foi possível completar a requisição tempo limite alcançado, verifique sua conexão";
  return error;
};

export default decodeError;
