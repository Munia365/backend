export interface CreateReviewPayload {
  userId: string;
  medicineId: string;
  orderId: string;
  rating: number; 
  comment?: string;
}
