
const dateFields = ['paidDate', 'spentDate']
const enumFields = ['itemType', 'paymentType', 'spentType']
const lockedFields = ['id']
const validationBudgetFields = ['id', 'paidDate', 'spentDate', 'itemType', 'paymentType', 'spentType', 'amount', 'paidAmount', 'description', 'owner']

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const budgetHeaders = [
    { label: "ID", key: "id" },
    { label: "Spent Type", key: "spentType" },
    { label: "Paid Date", key: "paidDate" },
    { label: "Spent Date", key: "spentDate" },
    { label: "Owner", key: "owner" },
    { label: "Item Category", key: "itemType" },
    { label: "Description", key: "description" },
    { label: "Paid Via", key: "paymentType" },
    { label: "Amount (My Share)", key: "amount" },
    { label: "Paid Amount (Total Share)", key: "paidAmount" },
  ];
  
const itemDetailHeaders = [
    { label: "ID", key: "id" },
    { label: "Item Name", key: "itemName" },
    { label: "Item Quantity", key: "itemQty" },
    { label: "Unit", key: "unit" },
    { label: "Item price", key: "itemPrice" },
  ];

const spentTypeEnum = Object.freeze({
    EXPENSE: "Expense",
    INCOME: "Income",
    OTHER: "Other",
    SELF_TRANSFER_OUT: "Self Transfer Out",
    SELF_TRANSFER_IN: "Self Transfer In",
  });
  
const paymentTypeEnum = Object.freeze({
    AMAZON_ICICI_CC: "Amazon ICICI Credit Card",
    AMAZON_BALANCE: "Amazon Balance",
    HDFC_BANK: "HDFC Bank",
    HSBC_CC: "HSBC Credit Card",
    IDFC_CC: "IDFC Credit Card",
    IDFC_BANK: "IDFC Bank",
    MILENIA_HDFC_CC: "Milenia HDFC Credit Card",
    NEU_HDFC_CC: "Neu HDFC Credit Card",
    ONE_CARD_CC: "One Card Credit Card",
    PLUXEE: "Pluxee",
    PNB_BANK: "PNB Bank",
    SBI_BANK: "SBI Bank",
    CASH: "Cash",
    SLICE_BANK: "Slice"
  });
  
const itemCategoryEnum = Object.freeze({
    MISC: "Miscellaneous",
    RENT: "Rent",
    HOME_UTIL: "Home Utilities",
    MOB_RECHARGE: "Mobile Recharge",
    INTERNET_RECHARGE: "Internet Recharge",
    TRAVEL: "Travel",
    TRAVEL_MISC: "Travel Miscellaneous",
    BIKE: "Bike",
    BIKE_MISC: "Bike Miscellaneous",
    PERSONAL_CARE: "Personal Care",
    MEDICAL: "Medical",
    CLOTHING: "Clothing",
    COSMETIC: "Cosmetics",
    FOOD: "Food",
    GROCERY: "Grocery",
    INVESTMENT: "Investment",
    ENTERTAINMENT: "Entertainment",
    BINTEREST: "Bank Interest",
    OINTEREST: "Other Interest",
    OTHER: "Other",
    UDHAAR: "Udhaar",
    SALARY: "Salary",
  });  

export {
    budgetHeaders,
    itemDetailHeaders,
    spentTypeEnum,
    paymentTypeEnum,
    itemCategoryEnum,
    enumFields,
    dateFields,
    lockedFields,
    validationBudgetFields,
    monthNames,
};