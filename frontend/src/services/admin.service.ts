import {
  getVendors,
  saveVendors,
} from "./vendor.service";

import {
  getUsers,
  saveUsers,
} from "./auth.service";

import { emailService } from "./email.service";

class AdminService {
  async approveVendor(
    vendorId: number
  ) {
    const vendors = await getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    const user = users.find(
      (item) => item._id === (vendor as any).userId
    );

    if (user) {
      user.status = "approved";
      user.updatedAt =
        new Date().toISOString();

      emailService.sendEmail(
        user.email,
        "Vendor Approved",
        `
Congratulations!

Your vendor account has been approved.

You can now login and receive bookings.

Thank you for joining Wedding Planner.
`
      );
    }

    saveVendors();
    saveUsers(users);

    return true;
  }

  async rejectVendor(
    vendorId: number
  ) {
    const vendors = await getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    const user = users.find(
      (item) => item._id === (vendor as any).userId
    );

    if (user) {
      user.status = "rejected";
      user.updatedAt =
        new Date().toISOString();

      emailService.sendEmail(
        user.email,
        "Vendor Application Update",
        `
Hello ${user.name},

We're sorry.

Your vendor application has been rejected.

Please contact support if you need more information.

Thank you.
`
      );
    }

    saveVendors();
    saveUsers(users);

    return true;
  }

  async deleteVendor(
    vendorId: number
  ) {
    const vendors = await getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    saveVendors();

    saveUsers(
      users.filter(
        (user) =>
          user._id !==
          (vendor as any).userId
      )
    );

    return true;
  }
}

export const adminService =
  new AdminService();