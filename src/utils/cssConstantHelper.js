const tableRowCSS = "border-t border-gray-200 transition-all duration-150 whitespace-nowrap"
const theadCSS = "bg-indigo-600 text-white uppercase tracking-wide"
const tableCSS = "min-w-full text-[0.875em] text-left text-gray-100"
const tdCSS = "px-1 py-4 text-center"
const inputCSS = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
const inputddCSS = "w-auto border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
const ddOptionCSS = "bg-neutral-800"
const buttonCSS = "w-max bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
const linkButtonCSS = "inline-block rounded-lg border border-transparent px-4 py-2 text-[0.875em] font-medium bg-indigo-600 text-white cursor-pointer transition-all duration-300 hover:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300"
const errorTextCSS = "text-red-500 text-[0.8em]"

const spentTypeColorMap = {
  EXPENSE: "bg-red-100 text-red-600 hover:bg-inherit hover:text-inherit",
  OTHER: "bg-yellow-100 text-yellow-600 hover:bg-inherit hover:text-inherit",
  INCOME: "bg-blue-100 text-blue-600 hover:bg-inherit hover:text-inherit",
  SELF_TRANSFER_OUT: "bg-green-100 text-green-600 hover:bg-inherit hover:text-inherit",
  SELF_TRANSFER_IN: "bg-green-100 text-green-600 hover:bg-inherit hover:text-inherit",
};

export {
  spentTypeColorMap,
  tableRowCSS,
  theadCSS,
  tableCSS,
  tdCSS,
  inputCSS,
  inputddCSS,
  ddOptionCSS,
  buttonCSS,
  linkButtonCSS,
  errorTextCSS
};