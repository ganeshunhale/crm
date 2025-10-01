export const paymentMethods = [
  {
    id: "binance",
    name: "BinancePay",
    processing: "Instant - 30 minutes",
    fee: "0 %",
    minLimit: 10,
    maxLimit: 20000,
    logo: "https://public.bnbstatic.com/static/images/common/favicon.ico",
    unavailable: true,
  },
  {
    id: "cheezee",
    name: "CheezeePay",
    processing: "Instant",
    fee: "0 %",
    minLimit: 10,
    maxLimit: 15000,
    logo: "https://pay.cheezeebit.com/favicon.ico",
    unavailable: false,
  },
  {
    id: "jenapay",
    name: "JenaPay",
    processing: "Instant",
    fee: "0 %",
    minLimit: 10,
    maxLimit: 15000,
    logo: "https://jenapay.com/wp-content/uploads/2023/09/cropped-JenaPay-Logo-02-32x32.png",
    unavailable: false,
  },
];
export const widrowalMethods = [
  {
    provider: "CheezeePay",
    method: "P2P_UPI",
    fee: "0 %",
    minLimit: 800,
    maxLimit: 15000,
    logo: "https://pay.cheezeebit.com/favicon.ico",
    unavailable: false,
  },
 {
    provider: "CheezeePay",
    method: "P2P_BANK_IN",
    fee: "0 %",
    minLimit: 800,
    maxLimit: 15000,
    logo: "https://pay.cheezeebit.com/favicon.ico",
    unavailable: false,
  },
   {
    provider: "CheezeePay",
    method: "P2P_BANK_IN",
    fee: "0 %",
    minLimit: 800,
    maxLimit: 15000,
    logo: "https://pay.cheezeebit.com/favicon.ico",
    unavailable: false,
  },
]

export const currencies = ["USD", "EUR", "INR"];
