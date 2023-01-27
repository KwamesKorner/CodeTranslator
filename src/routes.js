import React from 'react';
import { Route, Routes } from 'react-router-dom';

import BABL from './babl';
import COMP from './comp';

const Routing = () => {
  return (
    <>
    <Routes>
      <Route exact path="/" element={<BABL/>} />
      <Route path="/comp" element={<COMP/>} />
    </Routes>
    </>
  );
};

export default Routing;