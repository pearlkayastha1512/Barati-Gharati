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
  approveVendor(vendorId: number) {
    const vendors = getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    // Update Vendor
    vendor.approvalStatus = "approved";

    vendor.updatedAt = new Date().toISOString();

    // Update User
    const user = users.find(
      (item) => item._id === vendor.userId
    );

    if (user) {
      user.status = "approved";

      user.updatedAt = new Date().toISOString();

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

    saveVendors(vendors);

    saveUsers(users);

    return true;
  }

  rejectVendor(vendorId: number) {
    const vendors = getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    // Update Vendor
    vendor.approvalStatus = "rejected";

    vendor.updatedAt = new Date().toISOString();

    // Update User
    const user = users.find(
      (item) => item._id === vendor.userId
    );

    if (user) {
      user.status = "rejected";

      user.updatedAt = new Date().toISOString();

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

    saveVendors(vendors);

    saveUsers(users);

    return true;
  }

  deleteVendor(vendorId: number) {
    const vendors = getVendors();

    const users = getUsers();

    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    if (!vendor) {
      return false;
    }

    saveVendors(
      vendors.filter(
        (item) => item.id !== vendorId
      )
    );

    saveUsers(
      users.filter(
        (user) => user._id !== vendor.userId
      )
    );

    return true;
  }
}

export const adminService = new AdminService();