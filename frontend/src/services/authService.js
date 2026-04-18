import api from "./api";

export const register = async (payload) => {
  console.log("Register API request started", {
    url: `${api.defaults.baseURL}/auth/register`,
    payload: {
      name: payload.name,
      email: payload.email,
      hasPassword: Boolean(payload.password),
    },
  });

  try {
    const { data } = await api.post("/auth/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Register API request succeeded", data);
    return data;
  } catch (error) {
    console.error("Register API request failed", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
