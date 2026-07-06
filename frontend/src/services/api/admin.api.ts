const API_URL = "http://localhost:8000/api/v1/admin";

import { useAuthStore } from "@/store/authStore";

function getHeaders() {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ================================
// Dashboard
// ================================

export async function getDashboardApi() {
  const response = await fetch(
    `${API_URL}/dashboard`,
    {
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

// ================================
// Vendors
// ================================

export async function getAllVendorsApi() {
  const response = await fetch(
    `${API_URL}/vendors`,
    {
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

export async function getVendorByIdApi(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/vendors/${id}`,
    {
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

export async function approveVendorApi(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/vendors/${id}/approve`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

export async function rejectVendorApi(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/vendors/${id}/reject`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}

export async function deleteVendorApi(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/vendors/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const result = await response.json();

  return {
    ok: response.ok,
    data: result,
  };
}