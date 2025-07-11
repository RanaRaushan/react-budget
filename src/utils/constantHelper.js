
const dateFields = ['paidDate', 'spentDate', 'investmentDate', 'maturityDate']
const enumFields = ['itemType', 'paymentType', 'spentType', 'investmentType', 'compoundingFrequency']
const lockedFields = ['id', 'period', 'maturityAmount', 'maturityTimeLeftInDays', 'perUnitPrice']
const inputDropDownFields = ['description', 'category', 'itemName', 'itemDescription']
const validationAddBudgetFields = ['paidDate', 'spentDate', 'itemType', 'paymentType', 'spentType', 'amount', 'paidAmount', 'description', 'owner']
const validationUpdateBudgetFields = ['id', 'paidDate', 'spentDate', 'itemType', 'paymentType', 'spentType', 'amount', 'paidAmount', 'description', 'owner']
const validationAddBudgetDetailEntryFields = ['itemName', 'category', 'itemQty', 'itemPrice', 'owner']
const validationUpdateBudgetDetailEntryFields = ['id', 'category', 'itemName', 'itemQty', 'itemPrice', 'owner']
const validationAddInvestmentFields = ['id', 'investmentType', 'description', 'interestRate', 'investmentAmount', 'investmentDate', 'maturityDate', 'compoundingFrequency']
const validationUpdateInvestmentFields = ['investmentType', 'description', 'interestRate', 'investmentAmount', 'investmentDate', 'maturityDate', 'compoundingFrequency']

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
    { label: "Name", key: "itemName" },
    { label: "Owner", key: "owner" },
    { label: "Category", key: "category" },
    { label: "Weight", key: "itemWeight" },
    { label: "Unit", key: "unit" },
    { label: "Quantity", key: "itemQty" },
    { label: "Per Item Price", key: "perUnitPrice" },
    { label: "Price", key: "itemPrice" },
    { label: "Refer Transaction Id", key: "referTransactionId" },
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
    AMAZON_BAL_WALLET: "Amazon Balance",
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
    SLICE_BANK: "Slice Bank",
    BB_NOW_BAL_WALLET: "BB Now Wallet",
    TOLL_SMART_CARD_WALLET: "Toll Smart Card",
  });  

const accountTypeEnum = Object.freeze({
    HDFC: "HDFC Bank",
    IDFC : "IDFC Bank",
    PNB : "PNB Bank",
    SBI : "SBI Bank",
    SLICE : "Slice Bank",
    BB_NOW_BAL : "BB Now Wallet",
    AMAZON_BAL : "Amazon Wallet",
    TOLL_SMART_CARD: "Toll Smart Card",
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
    CC_PAY: "Credit Payment",
    MONEY_TRANSFERS_AND_WITHDRAWALS: "Money Transfers & Withdrawals",
    SETTLED_EXPENSES: "Settled Expenses"
  });  

const investmentHeaders = [
    { label: "ID", key: "id" },
    { label: "Investment Type", key: "investmentType" },
    { label: "Description", key: "description" },
    { label: "Rate", key: "interestRate" },
    { label: "Period(Yr)", key: "period" },
    { label: "Investment Amount", key: "investmentAmount" },
    { label: "Investment Date", key: "investmentDate" },
    { label: "Maturity Amount", key: "maturityAmount" },
    { label: "Maturity Date", key: "maturityDate" },
    { label: "Mature in(Day)", key: "maturityTimeLeftInDays" },
    { label: "Compounding Frequency", key: "compoundingFrequency" },
  ];


const investmentTypeEnum = Object.freeze({
    NSC: "NSC",
    FD: "Fixed Deposit",
    BOND: "Bond",
    NPS: "NPS",
  });

const compoundingFrequencyEnum = Object.freeze({
    ANNUALLY: "annually",
    SEMI_ANNUALLY: "semi_annually",
    QUARTERLY: "quarterly",
    MONTHLY: "monthly",
    WEEKLY: "weekly",
    DAILY: "daily",
  });

export {
    budgetHeaders,
    itemDetailHeaders,
    spentTypeEnum,
    paymentTypeEnum,
    itemCategoryEnum,
    accountTypeEnum,
    enumFields,
    dateFields,
    lockedFields,
    inputDropDownFields,
    validationAddBudgetFields,
    validationUpdateBudgetFields,
    validationAddBudgetDetailEntryFields,
    validationUpdateBudgetDetailEntryFields,
    validationAddInvestmentFields,
    validationUpdateInvestmentFields,
    monthNames,
    investmentHeaders,
    investmentTypeEnum,
    compoundingFrequencyEnum,
};