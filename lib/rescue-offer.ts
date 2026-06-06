export const messageRescueOffer = {
  slug: "message-overload-rescue",
  name: "Message Overload Rescue",
  shortName: "Message Rescue",
  price: 49,
  amount: 4900,
  currency: "gbp",
  messages: 3,
  deliveryMinutes: 15,
  checkoutSuccess: "rescue_success",
} as const;

export function getMessageRescueCatalog() {
  return {
    slug: messageRescueOffer.slug,
    name: messageRescueOffer.name,
    shortName: messageRescueOffer.shortName,
    price: messageRescueOffer.price,
    amount: messageRescueOffer.amount,
    currency: messageRescueOffer.currency,
    messages: messageRescueOffer.messages,
    deliveryMinutes: messageRescueOffer.deliveryMinutes,
  };
}
