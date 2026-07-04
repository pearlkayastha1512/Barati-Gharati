"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";

import {
  getVendorByUserId,
  updateVendor,
} from "@/services/vendor.service";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditVendorProfileModal({
  open,
  onClose,
}: Props) {
  const { user } = useAuthStore();

const [vendor, setVendor] = useState(
  () => (user ? getVendorByUserId(user._id) : null)
);

useEffect(() => {
  if (open && user) {
    setVendor(getVendorByUserId(user._id) ?? null);
  }
}, [open, user?._id]);

  const [ownerName, setOwnerName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [businessName, setBusinessName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [city, setCity] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [instagram, setInstagram] =
    useState("");

  const [facebook, setFacebook] =
    useState("");

  const [youtube, setYoutube] =
    useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");

    const [gstNumber, setGstNumber] =
  useState("");

  const [coverImage, setCoverImage] =
    useState("");

  useEffect(() => {
    if (!open || !vendor) return;

    setOwnerName(vendor.ownerName);

    setEmail(vendor.email);

    setPhone(vendor.phone);

setGstNumber(vendor.gstNumber ?? "");

setBusinessName(vendor.businessName);

setCategory(vendor.category);

setCity(vendor.city);

setAddress(vendor.address);

setDescription(vendor.description ?? "");

setWebsite(vendor.website ?? "");

setInstagram(vendor.instagram ?? "");

setFacebook(vendor.facebook ?? "");

setYoutube(vendor.youtube ?? "");

setLinkedin(vendor.linkedin ?? "");

setExperience(vendor.experience ?? "");

setProfileImage(vendor.profileImage ?? "");

setCoverImage(vendor.coverImage ?? "");
  }, [open, vendor?.id]);

  const handleProfileImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(
      URL.createObjectURL(file)
    );
  };

  const handleCoverImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(
      URL.createObjectURL(file)
    );
  };

  const handleSave = () => {
    if (!vendor) return;

    if (
      !businessName ||
      !ownerName ||
      !phone ||
      !email
    ) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }

     console.log({
  website,
  instagram,
  facebook,
  linkedin,
  youtube,
  experience,
  gstNumber,
});
    updateVendor({
      ...vendor,

      ownerName,

      email,
      gstNumber,

      phone,

      businessName,

      category,

      city,

      address,

      description,

      website,

      instagram,

      facebook,

      youtube,

      linkedin,

      experience,

      profileImage,

      coverImage,

      updatedAt:
        new Date().toISOString(),
    });

   toast.success("Profile updated successfully.");

onClose();
  };

  if (!open || !vendor) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-6">

          <h2 className="text-3xl font-bold text-slate-900">
            Edit Vendor Profile
          </h2>

          <button onClick={onClose} className=" text-gray-600">
            <X />
          </button>

        </div>

        {/* Body */}

        {/* Body */}

<div className="space-y-8 p-8">

  {/* Business Information */}

  <div className="grid gap-6 md:grid-cols-2">

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Business Name
    </label>

    <input
      value={businessName}
      onChange={(e) =>
        setBusinessName(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600 text-gray-600"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Owner Name
    </label>

    <input
      value={ownerName}
      onChange={(e) =>
        setOwnerName(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Email
    </label>

    <input
      type="email"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Phone
    </label>

    <input
      value={phone}
      onChange={(e) =>
        setPhone(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Category
    </label>

    <select
      value={category}
      onChange={(e) =>
        setCategory(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    >
      <option value="">
        Select Category
      </option>

      <option>Photographer</option>
      <option>Wedding Venue</option>
      <option>Decorator</option>
      <option>Caterer</option>
      <option>Makeup Artist</option>
      <option>Mehendi Artist</option>
      <option>DJ</option>
      <option>Band</option>
      <option>Wedding Planner</option>
    </select>
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Experience
    </label>

    <input
      value={experience ?? ""}
      onChange={(e) =>
        setExperience(e.target.value)
      }
      placeholder="5 Years"
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

  <div>
  <label className="mb-2 block font-medium text-slate-700">
    GST Number
  </label>

  <input
   value={gstNumber ?? ""}
    onChange={(e) =>
      setGstNumber(e.target.value)
    }
    placeholder="GST Number"
    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600 text-gray-600"
  />
</div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      City
    </label>

    <input
      value={city}
      onChange={(e) =>
        setCity(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium text-slate-700">
      Address
    </label>

    <input
      value={address}
      onChange={(e) =>
        setAddress(e.target.value)
      }
      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
    />
  </div>

</div>

<div>

  <label className="mb-2 block font-medium text-slate-700">
    Business Description
  </label>

  <textarea
    rows={5}
    value={description}
    onChange={(e) =>
      setDescription(e.target.value)
    }
    className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-600  text-gray-600"
  />

</div>

{/* Social Links */}

<div className="grid gap-6 md:grid-cols-2">

 <input
  value={website ?? ""}
  onChange={(e) => {
    console.log("Website:", e.target.value);
    setWebsite(e.target.value);
  }}
  placeholder="Website"
  className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600 text-gray-600"
/>

  <input
    value={instagram ?? ""}
    onChange={(e) =>
      setInstagram(e.target.value)
    }
    placeholder="Instagram"
    className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
  />

  <input
    value={facebook ?? ""}
    onChange={(e) =>
      setFacebook(e.target.value)
    }
    placeholder="Facebook"
    className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
  />

  <input
    value={youtube ?? ""}
    onChange={(e) =>
      setYoutube(e.target.value)
    }
    placeholder="YouTube"
    className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
  />

  <input
   value={linkedin ?? ""}
    onChange={(e) =>
      setLinkedin(e.target.value)
    }
    placeholder="LinkedIn"
    className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-600  text-gray-600"
  />

</div>

{/* Images */}

<div className="grid gap-8 md:grid-cols-2">

  <div>

    <label className="mb-3 block font-medium text-slate-700">
      Profile Image
    </label>

    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5">

      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="mx-auto h-40 w-40 rounded-full object-cover text-gray-600"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          No Image
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImage}
        className="mt-5 block w-full text-sm  text-gray-600"
      />

    </div>

  </div>

  <div>

    <label className="mb-3 block font-medium text-slate-700">
      Cover Image
    </label>

    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5">

      {coverImage ? (
        <img
          src={coverImage}
          alt="Cover"
          className="h-40 w-full rounded-xl object-cover  text-gray-600"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          No Cover Image
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImage}
        className="mt-5 block w-full text-sm"
      />

    </div>

  </div>

</div>

{/* Footer */}

<div className="flex justify-end gap-3 border-t px-8 py-6">

  <button
    onClick={onClose}
    className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
  >
    Cancel
  </button>

 <button
  type="button"
  onClick={handleSave}
  className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
>
  Save Changes
</button>
</div>


      </div>
    </div>

    </div>
  );
}