export const ORDER_TYPE_CONSTANT = {
  0: "Buy",
  1: "Sell",
  2: "Buy_limit",
  3: "Sell_limit",
  4: "Buy_stop",
  5: "Sell_stop",
  6: "Buy_stop_limit",
  7: "Sell_stop_limit",
  8: "Close_by"
}
export const CURRENCIES = [
  { code: 'USD', name: 'United States Dollar' },
  // { code: 'EUR', name: 'Euro' },
  // { code: 'JPY', name: 'Japanese Yen' },
  // { code: 'GBP', name: 'British Pound Sterling' },
  // { code: 'AUD', name: 'Australian Dollar' },
  // { code: 'CAD', name: 'Canadian Dollar' },
  // { code: 'CHF', name: 'Swiss Franc' },
  // { code: 'CNY', name: 'Chinese Yuan' },
  // { code: 'SEK', name: 'Swedish Krona' },
  // { code: 'NZD', name: 'New Zealand Dollar' },
  // { code: 'MXN', name: 'Mexican Peso' },
  // { code: 'SGD', name: 'Singapore Dollar' },
  // { code: 'HKD', name: 'Hong Kong Dollar' },
  // { code: 'NOK', name: 'Norwegian Krone' },
  // { code: 'KRW', name: 'South Korean Won' },
  // { code: 'TRY', name: 'Turkish Lira' },
  // { code: 'INR', name: 'Indian Rupee' },
  // { code: 'RUB', name: 'Russian Ruble' },
  // { code: 'BRL', name: 'Brazilian Real' },
  // { code: 'ZAR', name: 'South African Rand' },
  // { code: 'AED', name: 'United Arab Emirates Dirham' },
  // { code: 'ARS', name: 'Argentine Peso' },
  // { code: 'THB', name: 'Thai Baht' },
  // { code: 'IDR', name: 'Indonesian Rupiah' },
  // { code: 'MYR', name: 'Malaysian Ringgit' },
  // { code: 'PHP', name: 'Philippine Peso' },
  // { code: 'PLN', name: 'Polish Zloty' },
  // { code: 'DKK', name: 'Danish Krone' },
  // { code: 'HUF', name: 'Hungarian Forint' },
  // { code: 'CZK', name: 'Czech Koruna' },
  // { code: 'ILS', name: 'Israeli New Shekel' },
  // { code: 'SAR', name: 'Saudi Riyal' },
  // { code: 'VND', name: 'Vietnamese Dong' },
  // { code: 'EGP', name: 'Egyptian Pound' },
  // { code: 'PKR', name: 'Pakistani Rupee' },
];

export const MAXLEVERAGE = [
  { label: '1:2', value: '2' },
  { label: '1:20', value: '20' },
  { label: '1:50', value: '50' },
  { label: '1:100', value: '100' },
  { label: '1:200', value: '200' },
  { label: '1:400', value: '400' },
  { label: '1:500', value: '500' },
  { label: '1:600', value: '600' },
  { label: '1:800', value: '800' },
  { label: '1:1000', value: '1000' },
  { label: '1:2000', value: '2000' },
];

// DATE RANGES
export const DATES = [
  { label: 'Last 1 day', value: 1 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 365 days', value: 365 },
]

export const TRANSACTION_TYPE = [
  { label: 'All Transactions', value: 'all' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
]
export const STATUS = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Success', value: 'Success' },
  { label: 'Failure', value: 'Failure' },
  { label: 'Refund', value: 'Refund' },
  { label: 'Partial Payment', value: 'Partial Payment' },
]