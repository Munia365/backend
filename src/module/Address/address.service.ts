import { prisma } from "../../lib/prisma";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "../../types/address";
const createAddress = async (input: CreateAddressInput) => {
  const {
    userId,
    fullName,
    phone,
    country = "Bangladesh",
    city,
    state,
    area,
    postalCode,
    addressLine,
    label,
    isDefault = false,
  } = input;
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  const address = await prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      country,
      city,
      state,
      area,
      postalCode,
      addressLine,
      label,
      isDefault,
    },
  });
  return address;
};
const updateAddress = async (input: UpdateAddressInput) => {
  const {
    id,
    userId,
    fullName,
    phone,
    country,
    city,
    state,
    area,
    postalCode,
    addressLine,
    label,
    isDefault,
  } = input;
  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });
  if (!existingAddress) {
    throw new Error("Address not found");
  }
  if (existingAddress.userId !== userId) {
    throw new Error("Unauthorized to update this address");
  }
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }
  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      fullName,
      phone,
      country,
      city,
      state,
      area,
      postalCode,
      addressLine,
      label,
      isDefault,
    },
  });
  return updatedAddress;
};
const deleteAddress = async (addressId: string, userId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });
  if (!address) {
    throw new Error("Address not found");
  }
  if (address.userId !== userId) {
    throw new Error("Unauthorized to delete this address");
  }
  const deleted = await prisma.address.delete({
    where: { id: addressId },
  });
  return deleted;
};
const getAllAddresses = async () => {
  const addresses = await prisma.address.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });
  return addresses;
};
const getMyAddresses = async (userId: string) => {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return addresses;
};
const getMyAddressById = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });
  if (!address) {
    throw new Error("Address not found");
  }
  if (address.userId !== userId) {
    throw new Error("Address not found or access denied");
  }
  return address;
};
export const addressService = {
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAddresses,
  getMyAddresses,
  getMyAddressById,
};
