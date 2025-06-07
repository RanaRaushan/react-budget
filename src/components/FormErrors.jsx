import { useState } from 'react';
import { dateFields, enumFields, itemCategoryEnum, lockedFields, paymentTypeEnum, spentTypeEnum } from '../utils/constantHelper';
import { ddOptionCSS, errorTextCSS, inputCSS, inputddCSS } from '../utils/cssConstantHelper';

const LOG_PREFIX = "FormErrorsComponent::"

export default function FormErrorsComponent({errors, header, intent}) {

  return (
    <>
        {errors && errors[intent + "-" + header.key] ?  <p className={`${errorTextCSS}`}>{errors[intent + "-" + header.key]}</p>
                : errors && <p className={`${errorTextCSS} pt-3.5`}></p>
            }
    </>
  );
};
