// services/api/invoice.api.ts

import api from "../../lib/axios"

export async function regenerateInvoiceApi(
  bookingId: string
) {
  try {
    const response = await api.post(
      `/invoice/regenerate/${bookingId}`
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      data: null,
    };
  }
}