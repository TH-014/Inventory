import React, { createContext,useState } from 'react';


const supplierIdContext = createContext({
  status: 0,
  changeId: () => {},
});

export default supplierIdContext;
