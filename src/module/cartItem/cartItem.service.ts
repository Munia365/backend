import { prisma } from "../../lib/prisma";
import type { CreateCartItemPayload } from "../../types/cartItem";
const createCartItem = async ({
  userId,
  medicineId,
  quantity = 1,
}: CreateCartItemPayload) => {
  return await prisma.$transaction(async (tx) => {
    const medicine = await tx.medicine.findUnique({
      where: { id: medicineId },
    });

    if (!medicine || !medicine.isActive) {
      throw new Error("Medicine not available");
    }
    const existingCartItem = await tx.cartItem.findUnique({
      where: {
        userId_medicineId: {
          userId,
          medicineId,
        },
      },
    });
    const totalQuantityNeeded = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;
    if (medicine.stock < totalQuantityNeeded) {
      throw new Error(
        `Insufficient stock. Only ${medicine.stock} items available`,
      );
    }
    if (existingCartItem) {
      return await tx.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              discountPrice: true,
              stock: true,
              image: true,
              slug: true,
            },
          },
        },
      });
    }
    return await tx.cartItem.create({
      data: {
        userId,
        medicineId,
        quantity,
      },
      include: {
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            stock: true,
            image: true,
            slug: true,
          },
        },
      },
    });
  });
};
const getMyCart = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          stock: true,
          image: true,
          slug: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
const deleteCartItem = async (cartItemId: string, userId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }
  if (cartItem.userId !== userId) {
    throw new Error("Unauthorized to delete this cart item");
  }
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};
const updateCartItemQuantity = async (
  cartItemId: string,
  userId: string,
  quantity: number,
) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }
  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { medicine: true },
    });
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    if (cartItem.userId !== userId) {
      throw new Error("Unauthorized to update this cart item");
    }
    if (!cartItem.medicine.isActive) {
      throw new Error("Medicine is no longer available");
    }
    if (cartItem.medicine.stock < quantity) {
      throw new Error(
        `Only ${cartItem.medicine.stock} items available in stock`,
      );
    }
    return await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            stock: true,
            image: true,
            slug: true,
          },
        },
      },
    });
  });
};
export const cartItemService = {
  createCartItem,
  getMyCart,
  deleteCartItem,
  updateCartItemQuantity,
};
