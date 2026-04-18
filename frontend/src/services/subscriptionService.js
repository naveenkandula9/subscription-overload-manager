import api from "./api";

export const fetchSubscriptions = async () => {
  const { data } = await api.get("/subscriptions");
  return data.subscriptions;
};

export const createSubscription = async (payload) => {
  const { data } = await api.post("/subscriptions", payload);
  return data.subscription;
};

export const updateSubscription = async (id, payload) => {
  const { data } = await api.put(`/subscriptions/${id}`, payload);
  return data.subscription;
};

export const deleteSubscription = async (id) => {
  const { data } = await api.delete(`/subscriptions/${id}`);
  return data.subscription;
};

